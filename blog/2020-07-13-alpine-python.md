---
author: Pascal Vizeli
authorURL: https://github.com/pvizeli
authorTwitter: pvizeli
title: "Improving Python's speed by 40% when running Home Assistant"
---

We use Alpine for most of our Containers. It is the perfect distribution for containers because it is small (BusyBox based), available for a lot of CPU architectures, and the package system is slim. Alpine uses musl as their C library instead of the more commonly used glibc.

Alpine with musl are relatively young compared to their peers (15 and 9 years old) but have seen a significant development pace. Because things move so fast, a lot of misconceptions exist about both based on things that are no longer true. The goal of this post is to address a couple of those and how we have solved them.

This blogpost is not meant as a musl vs. glibc flamewar. Each use case is different and has its own trade-offs. For example, we use glibc in our OS.

For the tests, I used the images from [Docker Python library](https://github.com/docker-library/python), and the result is published to our [base images](https://github.com/home-assistant/docker-base). I used pyperformance for lab testing and the Home Assistant internal benchmark tools for more real-life comparison. The test environment was running inside a container on the same Docker host.

## C/POSIX standard library

I often read: Python is slower when it uses musl as the default C library. This fact is not 100% correct. If the Python runtime was compiled with the same GCC and with `-O3`, the glibc variant is a bit faster in the lab benchmark, but in the real world, the difference is insignificant. Alpine compiles it with `-Os` while most other distributions compile it with  `-O2`. This causes the often written difference between the Python runtime interpreters. But when using the same compiler optimizations, musl based Python runtimes have no negative side-effects.

But there is a game-changer, which makes the musl one more useful compared to the glibc-based runtime. It is the memory allocator [jemalloc](http://jemalloc.net/), a general-purpose malloc implementation that emphasizes fragmentation avoidance and scalable concurrency support. There is an interesting effect, which I found on some blogpost about Rust. There were some developers who saw that musl is much faster when using jemalloc compared to glibc, while glibc is slower when using jemalloc. For sure, the benefit with glibc and jemalloc is not the speed as they optimize memory management, but musl get both benefits. While the difference between pure musl and glibc can be ignored, the difference between musl + jemalloc and glibc are substantial (with disabled GCC memory allocator built-in optimization). Yes, today's jemalloc is compatible with musl (there was a time which it was not).

## Compiler

How you compile Python is also essential. There were statements from Fedora or Redhat about disable `semantic-interposition` to get a high-performance boost. I was not able to reproduce this on GCC 9.3.0, but I also saw no adverse side-effects. I can recommend disabling the semantics like the built-in allocator optimization and link jemalloc at build time. I will also recommend using the `-O3` optimization. We never saw an issue with these aggressive optimizations on our targeted platforms. I need to say, unlike the distro Python runtime interpreters, we don't need to run everywhere. So we can use the `--enable-optimizations` without any overwrite and add more flags. I can say today, PGO/LTO/O3 make Python faster and it works on our target CPUs.

## Python packages

Alpine indeed has no manylinux compatibility with musl. If you don't cache your builds, it needs to compile the C extensions when installing packages that require it. This process takes time, just like if you would cross-build with Qemu for different CPU architectures. You cannot get precompiled binaries from PyPi. This is not a problem for us as the provided binaries on PyPI are mostly not optimized for our target systems.

To fix installation times of Python package, we created our own [wheel index](https://wheels.home-assistant.io/) and [backend](https://github.com/home-assistant/wheels) to compile all needed wheels and keep it up to date using CI agents. We pre-build over 1k packages for each CPU architecture, and the build time of the Docker file is not so important at all.

## Alpine Linux

Alpine is a great base system for Container and allows us to provide the best experience to our user. A big thanks to Alpine Linux, musl, and jemalloc, which make this all possible.

The table shows the results comparing the Alpine Linux's Python runtime and our optimization (GCC 9.3.0/musl). All tests done using Python 3.8.3.


| Benchmark               | Alpine   | Optimized                     |
| ----------------------- | -------- | ----------------------------- |
| 2to3                    | 924 ms   | 699 ms: 1.32x faster (-24%)   |
| chameleon               | 37.9 ms  | 25.6 ms: 1.48x faster (-33%)  |
| chaos                   | 393 ms   | 273 ms: 1.44x faster (-31%)   |
| crypto_pyaes            | 373 ms   | 245 ms: 1.52x faster (-34%)   |
| deltablue               | 22.8 ms  | 16.4 ms: 1.39x faster (-28%)  |
| django_template         | 184 ms   | 145 ms: 1.27x faster (-21%)   |
| dulwich_log             | 157 ms   | 122 ms: 1.29x faster (-22%)   |
| fannkuch                | 1.81 sec | 1.32 sec: 1.38x faster (-27%) |
| float                   | 363 ms   | 263 ms: 1.38x faster (-28%)   |
| genshi_text             | 113 ms   | 83.9 ms: 1.34x faster (-26%)  |
| genshi_xml              | 226 ms   | 171 ms: 1.32x faster (-24%)   |
| go                      | 816 ms   | 598 ms: 1.36x faster (-27%)   |
| hexiom                  | 36.8 ms  | 24.2 ms: 1.52x faster (-34%)  |
| json_dumps              | 34.8 ms  | 25.6 ms: 1.36x faster (-26%)  |
| json_loads              | 61.2 us  | 47.4 us: 1.29x faster (-23%)  |
| logging_format          | 30.0 us  | 23.5 us: 1.28x faster (-22%)  |
| logging_silent          | 673 ns   | 486 ns: 1.39x faster (-28%)   |
| logging_simple          | 27.2 us  | 21.3 us: 1.27x faster (-22%)  |
| mako                    | 54.5 ms  | 35.6 ms: 1.53x faster (-35%)  |
| meteor_contest          | 344 ms   | 219 ms: 1.57x faster (-36%)   |
| nbody                   | 526 ms   | 305 ms: 1.73x faster (-42%)   |
| nqueens                 | 368 ms   | 246 ms: 1.49x faster (-33%)   |
| pathlib                 | 64.4 ms  | 45.2 ms: 1.42x faster (-30%)  |
| pickle                  | 20.3 us  | 17.1 us: 1.19x faster (-16%)  |
| pickle_dict             | 40.2 us  | 33.6 us: 1.20x faster (-16%)  |
| pickle_list             | 6.77 us  | 5.88 us: 1.15x faster (-13%)  |
| pickle_pure_python      | 1.85 ms  | 1.27 ms: 1.45x faster (-31%)  |
| pidigits                | 274 ms   | 222 ms: 1.24x faster (-19%)   |
| pyflate                 | 2.53 sec | 1.74 sec: 1.45x faster (-31%) |
| python_startup          | 14.9 ms  | 12.1 ms: 1.23x faster (-19%)  |
| python_startup_no_site  | 9.84 ms  | 8.24 ms: 1.19x faster (-16%)  |
| raytrace                | 1.61 sec | 1.23 sec: 1.30x faster (-23%) |
| regex_compile           | 547 ms   | 398 ms: 1.38x faster (-27%)   |
| regex_dna               | 445 ms   | 484 ms: 1.09x slower (+9%)    |
| regex_effbot            | 10.3 ms  | 9.96 ms: 1.03x faster (-3%)   |
| regex_v8                | 81.8 ms  | 71.6 ms: 1.14x faster (-12%)  |
| richards                | 265 ms   | 182 ms: 1.46x faster (-31%)   |
| scimark_fft             | 1.31 sec | 851 ms: 1.54x faster (-35%)   |
| scimark_lu              | 616 ms   | 384 ms: 1.61x faster (-38%)   |
| scimark_monte_carlo     | 390 ms   | 248 ms: 1.57x faster (-36%)   |
| scimark_sor             | 838 ms   | 571 ms: 1.47x faster (-32%)   |
| scimark_sparse_mat_mult | 19.0 ms  | 13.2 ms: 1.43x faster (-30%)  |
| spectral_norm           | 567 ms   | 388 ms: 1.46x faster (-32%)   |
| sqlalchemy_declarative  | 364 ms   | 286 ms: 1.27x faster (-21%)   |
| sqlalchemy_imperative   | 60.3 ms  | 46.8 ms: 1.29x faster (-22%)  |
| sqlite_synth            | 6.88 us  | 5.09 us: 1.35x faster (-26%)  |
| sympy_expand            | 1.39 sec | 1.05 sec: 1.32x faster (-24%) |
| sympy_integrate         | 67.3 ms  | 49.5 ms: 1.36x faster (-26%)  |
| sympy_sum               | 505 ms   | 389 ms: 1.30x faster (-23%)   |
| sympy_str               | 945 ms   | 656 ms: 1.44x faster (-31%)   |
| telco                   | 17.9 ms  | 12.5 ms: 1.44x faster (-31%)  |
| tornado_http            | 347 ms   | 273 ms: 1.27x faster (-21%)   |
| unpack_sequence         | 232 ns   | 212 ns: 1.09x faster (-9%)    |
| unpickle                | 41.6 us  | 30.7 us: 1.36x faster (-26%)  |
| unpickle_list           | 10.5 us  | 9.24 us: 1.14x faster (-12%)  |
| unpickle_pure_python    | 1.28 ms  | 945 us: 1.36x faster (-26%)   |
| xml_etree_parse         | 335 ms   | 292 ms: 1.15x faster (-13%)   |
| xml_etree_iterparse     | 281 ms   | 226 ms: 1.24x faster (-20%)   |
| xml_etree_generate      | 330 ms   | 219 ms: 1.51x faster (-34%)   |
| xml_etree_process       | 263 ms   | 181 ms: 1.45x faster (-31%)   |

