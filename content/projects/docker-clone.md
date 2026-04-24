Containers have revolutionized software deployment, but to many developers, Docker is just magic. You write a `Dockerfile`, run `docker build`, and suddenly your application runs identically on any machine. But what actually *is* a container?

To truly understand containerization, I built a miniature Docker clone from scratch in C. This project strips away the Go-based CLI and REST APIs of modern container engines and interacts directly with the Linux kernel to create isolated environments.

> [!note] The Secret
> "Containers" don't exist in the Linux kernel. A container is simply a standard Linux process that has been heavily restricted using three core kernel features: **Namespaces**, **cgroups**, and **chroot**.

---

## 1. Namespaces: The Illusion of Isolation

When you run `ps aux` inside a Docker container, you usually only see a few processes, starting with PID 1. However, the host machine is running thousands of processes. How does the container's shell not see the host's processes? The answer is **Namespaces**.

Namespaces restrict what a process can see. In my C implementation, creating a container starts by spawning a child process using the `clone()` system call rather than the standard `fork()`.

By passing specific flags to `clone()`, we instruct the kernel to put the new process in brand new namespaces:

```c
// Spawning an isolated child process
int flags = CLONE_NEWUTS |  // Isolate hostname
            CLONE_NEWPID |  // Isolate process IDs
            CLONE_NEWNS  |  // Isolate mount points
            CLONE_NEWNET |  // Isolate network interfaces
            SIGCHLD;        // Signal parent on exit
            
pid_t child_pid = clone(child_function, 
                        stack_memory + STACK_SIZE, 
                        flags, 
                        &config);
```

With `CLONE_NEWPID`, the child process believes it is PID 1. With `CLONE_NEWUTS`, we can call `sethostname("my-container")` inside the child without affecting the host machine's hostname.

---

## 2. The File System: `chroot` and `pivot_root`

Even if a process is in a new PID namespace, if it can still access `/etc/passwd` or `/home` on the host machine, it isn't truly isolated.

To solve this, the container engine needs to change the root directory of the child process.

1. **Download a Rootfs**: The engine requires a base image (like an extracted Alpine Linux root filesystem) stored in a directory, e.g., `./alpine-rootfs`.
2. **Mounts**: Before changing the root, the engine must mount essential virtual filesystems like `/proc` (so utilities like `ps` work inside the container).
3. **Pivot Root**: While `chroot` is the classic way to change the root directory, it has security flaws. Modern container runtimes use `pivot_root` to safely swap the old root mount for the new one, and then unmount the old host root entirely.

```c
// Inside the child process
// Mount the proc filesystem
mount("proc", "/alpine-rootfs/proc", "proc", 0, NULL);

// Change root directory to the alpine filesystem
if (chroot("/alpine-rootfs") != 0) {
    perror("chroot failed");
    return -1;
}

// Move to the new root
chdir("/");
```

---

## 3. Resource Limits: cgroups

A container isn't safe if it can consume 100% of the host's CPU and memory. To prevent this, the engine uses **Control Groups (cgroups)**.

Unlike Namespaces, which are accessed via system calls, cgroups are managed via a virtual filesystem, typically mounted at `/sys/fs/cgroup`.

To limit the memory of our container to 512MB, the C program performs standard file I/O operations:
1. It creates a new directory: `mkdir("/sys/fs/cgroup/memory/my_container")`.
2. It writes the memory limit to a file: `echo "536870912" > memory.limit_in_bytes`.
3. It attaches the child process to the cgroup: `echo "<child_pid>" > tasks`.

If the process inside the container tries to allocate more than 512MB, the kernel's Out-Of-Memory (OOM) killer will instantly terminate it, leaving the host system completely unaffected.

---

## 4. Execution and Cleanup

Once the namespaces are set, the root is pivoted, and the cgroups are configured, the final step is to execute the user's desired command (e.g., `/bin/sh`).

```c
// Replace the current process image with the shell
char *cmd[] = {"/bin/sh", NULL};
execvp(cmd[0], cmd);
```

Because the parent process (the container engine) is waiting via `waitpid()`, it blocks until the shell exits. Once the user types `exit`, the parent process wakes up and performs cleanup: unmounting `/proc`, deleting the cgroups, and freeing allocated memory.

---

## 5. Why Build This?

Building a Docker clone in C is an incredible exercise in systems programming. It reveals that the tools we use daily are not black boxes, but rather elegant orchestrations of fundamental OS primitives. 

By writing this engine, I gained a profound appreciation for kernel-level security, process lifecycle management, and the immense complexities of creating truly isolated execution environments on Linux.