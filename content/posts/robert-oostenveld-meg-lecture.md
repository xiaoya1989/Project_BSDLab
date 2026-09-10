---
slug: robert-oostenveld-meg-lecture
date: 2026-08-27
title_zh: "从信号到大脑：Robert Oostenveld 教授谈 MEG 如何定位与解析脑活动"
title_en: "From Signals to the Brain: Robert Oostenveld on Localizing and Disentangling Brain Activity with MEG"
summary_zh: "荷兰拉德堡大学 Donders Institute 的 Robert Oostenveld 教授受邀作 MEG 方法学报告，系统梳理信号产生、记录、时频分析与源重建。"
summary_en: "Robert Oostenveld of Radboud University's Donders Institute joined us for a methodological lecture on MEG, tracing the path from neural signal generation and recording to time-frequency analysis and source reconstruction."
cover_image: /posts/robert-oostenveld-meg-lecture/lecture-hall.jpg
wechat_cover_image: /posts/robert-oostenveld-meg-lecture/lecture-hall.jpg
tags:
  - academic lecture
  - MEG
  - source reconstruction
publish_to_wechat: false
---
<!-- zh -->
近日，我们邀请到荷兰 Radboud University Donders Institute 的 Robert Oostenveld 教授来到实验室交流，并作题为 **“Using MEG to Localize and Disentangle Brain Activity”** 的学术报告。

Robert 是 FieldTrip 工具箱的主要开发者之一，长期从事 EEG/MEG 方法学、脑电磁信号分析、源定位及开放科学研究。对于即将进一步开展 MEG 研究的我们来说，这次报告与其说是一次“MEG 技术介绍”，不如说是一次从神经元活动出发，沿着 **信号产生—信号记录—数据分析—源重建**，最终重新回到“大脑如何实现认知功能”的完整方法学梳理。

## 从神经元到头皮：我们究竟在测量什么？

报告从一个最基本的问题开始：**EEG 和 MEG 究竟记录的是什么？**

单个神经元的 action potential 非常短暂，相邻神经元之间只要存在轻微的时间差，宏观尺度上的信号就容易相互抵消。相比之下，postsynaptic potentials 更慢，当大量神经元同步活动时，即使存在一定的时间偏移，其产生的电流仍然能够有效叠加。

但仅有时间上的同步还不够。大脑皮层的 pyramidal neurons 具有相对规则的空间排列，大量方向相近的树突使微小电流能够在空间上进一步叠加。

因此，我们最终能够在头外记录到脑活动，依赖两个非常重要的条件：

> **temporal synchronization + spatial alignment**

这也解释了为什么 EEG 和 MEG 所看到的，并不是单个神经元的放电，而是大量神经元群体活动形成的宏观电磁信号。

## EEG 与 MEG：看到的是同一个大脑，却有不同的“视角”

神经电流会通过脑组织、脑脊液、颅骨和头皮传播。对于 EEG 而言，一个重要的问题是颅骨的导电性较差，因此电位在传播到头皮的过程中会发生明显的空间扩散。

MEG 则利用了另一个基本物理事实：

> **只要存在电流，就会产生磁场。**

与电位不同，神经活动产生的磁场穿过脑组织和颅骨时受到的扭曲要小得多。这也是 MEG 在空间分析上的重要优势之一。

但 MEG 并不是对所有神经源同样敏感。Robert 特别强调了 **source orientation** 的重要性。位于脑沟中的 pyramidal cells 所形成的电流往往具有较强的 tangential component，这类源通常能够产生清晰的 MEG 信号；而接近 radial orientation 的源，在理想情况下产生的外部磁场会明显减弱。

这意味着，看 MEG 数据时不能只问“哪里有活动”，还必须问：**这个神经源是什么方向？**

## 为什么不同 MEG 传感器看到的“大脑”并不一样？

Robert 随后从 SQUID 讲到了 magnetometer、planar gradiometer 和 axial gradiometer。

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-sensor-hardware.jpg" alt="Robert Oostenveld 教授介绍 Neuromag、Elekta 与 MEGIN 系统中的 MEG 传感器硬件" loading="lazy">
  <figcaption>Robert Oostenveld 教授从 MEG 系统硬件出发，介绍不同传感器的线圈结构。</figcaption>
</figure>

Magnetometer 直接测量磁场，因此既对脑内信号敏感，也容易受到远处环境磁场的影响。Gradiometer 测量的则是空间上的磁场梯度。远处噪声在两个相邻线圈上的磁场非常相似，相减之后能够被大幅抵消；来自大脑的近场信号则由于空间变化更快而被保留下来。

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-sensor-sensitivity-profile.jpg" alt="MEG sensor sensitivity profile 幻灯片比较 magnetometer、axial gradiometer 与 planar gradiometer" loading="lazy">
  <figcaption>不同线圈结构形成不同的 sensitivity profile，并决定各类 MEG sensor 对空间磁场的响应。</figcaption>
</figure>

一个非常实用的结论是：**MEG sensor topography 的形状与所使用的传感器类型密切相关。**

例如 planar gradiometer 的最大信号往往更接近神经源所在的位置，而 magnetometer 或 axial gradiometer 则可能表现为更加典型的双极磁场分布。因此，看到一张 MEG topography，第一件事情并不是寻找“最红的地方”，而是先搞清楚：**我们正在看什么传感器测到的什么物理量？**

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-topography-gradiometer.jpg" alt="Robert Oostenveld 教授比较不同 MEG 系统记录的 N400 磁场拓扑" loading="lazy">
  <figcaption>以 N400 response 为例，Robert 比较 axial magnetic field 与 planar gradient 所呈现的不同 topography。</figcaption>
</figure>

## 从 ERP/ERF 到脑振荡：平均有时也会把真正的信号平均掉

报告随后进入数据分析。对于重复出现的刺激，如果某一神经反应在每个 trial 中都具有相对稳定的 latency 和 phase，那么进行 trial averaging 后，一致的活动会保留下来，而随机背景活动则逐渐减弱。这就是经典的 ERP 和 ERF。

Robert 特别指出，随机噪声大约按照 **1 / √N** 随 trial 数增加而降低。因此，想把噪声再降低一半，并不是多收一倍 trial，而大约需要四倍 trial。这也是 EEG/MEG 实验经常需要大量重复试次的原因。

但并不是所有与任务有关的神经活动都会与刺激严格 phase-locked。一个 oscillation 可能每次刺激后都会增强，但有的 trial 从 peak 开始，有的从 trough 开始。直接平均原始波形，这些活动反而会彼此抵消。

这正是 **time-frequency analysis** 的意义所在。通过 Fourier decomposition、短时傅里叶分析或 wavelet analysis，我们可以先计算每个 trial 在不同时间和频率上的 power，再进行跨 trial 平均，从而保留那些与事件相关、但并不严格 phase-locked 的 **induced activity**。

> **ERP/ERF 告诉我们稳定的 evoked response；time-frequency analysis 则让我们看到更加丰富的 oscillatory dynamics。**

## MEG 真正的优势：不仅回答“什么时候”，还要回答“在哪里”

如果只做到 channel-level analysis，那么 EEG 和 MEG 实际上有很多共同的方法：ERP/ERF、frequency analysis、time-frequency analysis，以及进一步的 decoding、temporal response function（TRF）和 representational similarity analysis（RSA）。

Robert 随后把问题推进了一步：MEG 最值得利用的优势是什么？时间精度让我们知道 **when**，但真正理解大脑，还必须知道 **where**。

真实的认知过程并不是一个脑区单独完成的。感觉、注意、记忆和行为涉及多个脑区的 sequential 和 parallel processing。头外的每一个 MEG sensor 所记录到的，实际上都是多个神经源混合之后的结果。

Robert 用了一个非常形象的比喻：想象一个很多人同时讲话的 party。把一个麦克风放在房间中央，得到的是所有人声音的混合；而 source reconstruction 想做的事情，就像试图在每个人面前分别放置麦克风，从混合信号中恢复不同人的声音。

这就是 **disentangling brain activity**。

## 从“头外看到的影子”反推大脑内部

Source reconstruction 的核心包含两个方向相反的问题。

**Forward problem：** 如果我们知道大脑中某个神经源的位置、方向和强度，根据脑组织的 volume conductor model，计算它在头外应该产生怎样的 EEG/MEG spatial pattern。

**Inverse problem：** 我们已经测到了头外的 EEG/MEG，那么究竟是什么样的脑内活动产生了这些信号？

困难在于 inverse problem 是 **ill-posed** 的。同样一个头外磁场分布，可以由一个 dipole 产生，也可能由多个不同位置、不同方向和不同强度的 dipoles 共同产生；甚至一个较深的 source 与某些较浅的 source configuration 都可能形成非常相似的外部磁场。

因此，MEG source localization 并不存在唯一的数学答案。我们必须加入额外的 **assumptions / constraints**。

## 三类 source reconstruction 方法，其实代表三种不同的假设

Robert 将常见方法概括为三类。

**第一类：Single / multiple dipole models**

假设真正活跃的 cortical sources 数量很少，通过改变 dipole 的位置、方向和强度，使 forward model 尽可能拟合实际观测数据。这类方法特别适合比较 focal 的活动，例如早期 sensory responses 或 epilepsy 中的 interictal discharges。

**第二类：Distributed source models**

不再假设只有少量 source，而是在 cortical sheet 上放置大量候选 dipoles，再估计每一个位置的活动强度。由于未知参数远多于 sensor 数量，这是一个 underdetermined problem，因此必须增加 regularization，例如 minimum-norm constraint，寻找能够解释数据的相对“简单”的 solution。

**第三类：Spatial filtering / Beamforming**

Beamformer 换了一个思路。它针对脑中的每一个候选位置建立 spatial filter，通过对所有 MEG channels 进行加权组合，尽量保留目标位置的信号，同时抑制其他位置和背景活动的贡献。

Robert 特别提到，beamforming 已经成为 MEG source reconstruction 中非常有效的方法，尤其适合 cognitive tasks 和 oscillatory activity。但它同样有自己的假设，例如目标 source 与其他 sources 的时间序列不能高度相关。

所以并不存在“最好的 source localization algorithm”。真正的问题始终是：**这个方法的假设，与我的实验和数据是否匹配？**

## “Our questions are not about the skull. Our questions are about the brain.”

报告接近尾声时，Robert 用一句非常直接的话概括了 MEG 的意义：

> **“Our questions are not about the skull. Our questions are about the brain.”**

MEG 的磁场不像 EEG 电位那样被颅骨明显模糊，因此其 spatial topography 更加 focal；同时，MEG 的 forward model 相对容易建立。结合个体 anatomical MRI 和准确的 MEG-MRI coregistration，我们可以更自然地从 sensor space 回到 brain space。

而这也是 MEG 最吸引人的地方：我们记录的是头外的信号，但真正希望理解的是脑内不同区域如何按照特定的时间顺序，以 serial 和 parallel 的方式共同完成感觉、认知和行为。

换句话说，**MEG 的价值不只是“毫秒级时间分辨率”，而是尝试同时回答——大脑在什么时候、什么地方、以怎样的动态方式完成信息处理。**

## 工具只是开始：FieldTrip 与开放的方法学生态

最后，Robert 介绍了目前 EEG/MEG 研究中常用的开源分析工具，包括 EEGLAB、FieldTrip、Brainstorm、SPM 和 MNE-Python。他本人及团队已经持续开发 FieldTrip 二十余年。

与强调图形界面的软件不同，FieldTrip 采用 MATLAB scripting 的方式。这样的门槛可能稍高，但优势在于研究者不仅能够“使用一个分析方法”，还可以真正 **look under the hood**——理解算法究竟做了什么，并根据自己的科学问题进行扩展。

Robert 也强调，不同工具各有自己的优势。Brainstorm 更容易通过 GUI 上手，SPM 在 Bayesian modeling 和 Dynamic Causal Modeling 等方面具有特色，MNE-Python 则拥有 Python 和开放生态的优势。对于临床场景，经过针对性设计和认证的商业软件也有其不可替代的价值。

方法和工具从来不是目的。真正重要的是理解：

- **我们记录到了什么？**
- **分析方法做了什么？**
- **它依赖什么假设？**
- **最后，我们能够从数据中对大脑做出多强的推断？**

这可能也是这次报告留给我们最重要的启发。

---

从神经元产生的一点微弱电流，到头外只有 femtotesla 量级的磁场；从一条 sensor time series，到复杂的 time-frequency representation；再从头外的 magnetic topography，重新推断脑内不同区域的活动——MEG 的每一步，都连接着神经生物学、物理学、数学建模与认知科学。

对于刚开始接触 MEG 的研究者来说，也许最重要的不是马上掌握某一种软件或某一个 source reconstruction algorithm，而是建立起这样一条完整的逻辑链：

> **从大脑出发，理解信号；<br>
> 从信号出发，选择分析；<br>
> 从分析出发，再回到大脑。**

这也是我们期待在未来的 MEG 研究中不断学习和实践的方向。

<!-- en -->
We recently welcomed Professor Robert Oostenveld from the Donders Institute at Radboud University for a visit and a lecture titled **“Using MEG to Localize and Disentangle Brain Activity.”**

Robert is one of the principal developers of the FieldTrip toolbox. His work spans EEG/MEG methodology, electrophysiological and biomagnetic signal analysis, source localization, and open science. For a lab preparing to expand its MEG research, this was more than an introduction to a neuroimaging technique. It offered a complete methodological journey—from **signal generation and recording to data analysis and source reconstruction**, and ultimately back to the question of how the brain implements cognition.

## From neurons to the scalp: What are we actually measuring?

The lecture began with a fundamental question: **What do EEG and MEG actually record?**

An individual neuron's action potential is extremely brief. Even small timing differences between neighboring neurons can cause their signals to cancel at a macroscopic scale. Postsynaptic potentials are slower. When large populations of neurons are active together, their currents can add effectively despite modest temporal offsets.

Temporal synchrony alone, however, is not enough. Pyramidal neurons in the cortex have a relatively regular spatial organization. Their similarly oriented dendrites allow many tiny currents to add across space.

Our ability to record brain activity outside the head therefore depends on two key conditions:

> **temporal synchronization + spatial alignment**

This is why EEG and MEG do not show the firing of single neurons. They capture macroscopic electromagnetic signals produced by the coordinated activity of large neuronal populations.

## EEG and MEG: Different views of the same brain

Neural currents propagate through brain tissue, cerebrospinal fluid, the skull, and the scalp. For EEG, the skull's low conductivity causes electrical potentials to spread substantially before they reach the scalp.

MEG draws on another basic physical principle:

> **Wherever there is current, there is a magnetic field.**

Unlike electric potentials, the magnetic fields produced by neural activity are distorted far less as they pass through brain tissue and the skull. This is one of MEG's major advantages for spatial analysis.

MEG is not equally sensitive to every neural source. Robert emphasized the importance of **source orientation**. Currents generated by pyramidal cells in cortical sulci often have a strong tangential component and can produce clear MEG signals. Sources with an approximately radial orientation generate much weaker external magnetic fields under idealized conditions.

When interpreting MEG data, we therefore need to ask not only “Where is the activity?” but also: **What is the orientation of the neural source?**

## Why do different MEG sensors produce different views of the brain?

Robert moved from SQUID technology to magnetometers, planar gradiometers, and axial gradiometers.

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-sensor-hardware.jpg" alt="Robert Oostenveld introducing MEG sensor hardware used in Neuromag, Elekta, and MEGIN systems" loading="lazy">
  <figcaption>Robert Oostenveld introduces the coil configurations used in different MEG sensor systems.</figcaption>
</figure>

A magnetometer measures the magnetic field directly. It is sensitive to signals from the brain, but also to distant environmental interference. A gradiometer measures the spatial gradient of the field. Distant noise produces nearly identical fields in two neighboring coils and is largely canceled by subtraction, whereas the more rapidly varying near-field signal from the brain is retained.

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-sensor-sensitivity-profile.jpg" alt="MEG sensor sensitivity profile slide comparing a magnetometer, axial gradiometer, and planar gradiometer" loading="lazy">
  <figcaption>Different coil configurations produce distinct sensitivity profiles and spatial responses to the magnetic field.</figcaption>
</figure>

The practical lesson is that **the shape of an MEG sensor topography depends strongly on the sensor type**.

For example, the maximum signal in a planar gradiometer topography often lies closer to the underlying neural source, whereas magnetometers and axial gradiometers may show the more familiar bipolar magnetic-field pattern. Before searching a topography for “the reddest spot,” we must first ask: **Which physical quantity was measured, and by which type of sensor?**

<figure class="news-article__figure news-article__figure--wide">
  <img src="/posts/robert-oostenveld-meg-lecture/meg-topography-gradiometer.jpg" alt="Robert Oostenveld comparing N400 topographies recorded with different MEG systems" loading="lazy">
  <figcaption>Using the N400 response as an example, Robert compares the topographies of an axial magnetic field and a planar gradient.</figcaption>
</figure>

## From ERP and ERF to neural oscillations: Averaging can also remove a real signal

The lecture then turned to data analysis. If a neural response has a consistent latency and phase across repeated trials, trial averaging preserves that response while random background activity gradually decreases. This is the foundation of the classic ERP and ERF.

Robert noted that random noise falls approximately as **1 / √N** as the number of trials increases. Halving the noise therefore requires roughly four times as many trials, not twice as many. This is one reason EEG and MEG experiments often need substantial repetition.

Not all task-related neural activity is strictly phase-locked to a stimulus. An oscillation may increase after every stimulus, yet begin at a peak in some trials and a trough in others. Averaging the raw waveforms can make such activity cancel out.

This is where **time-frequency analysis** becomes essential. Fourier decomposition, short-time Fourier analysis, and wavelet analysis let us estimate power across time and frequency within each trial before averaging across trials. This preserves **induced activity** that is event-related but not strictly phase-locked.

> **ERP and ERF reveal stable evoked responses; time-frequency analysis exposes a richer set of oscillatory dynamics.**

## MEG's real strength: Answering not only “when,” but also “where”

At the channel level, EEG and MEG share many analytical methods: ERP/ERF, frequency analysis, time-frequency analysis, decoding, temporal response functions (TRF), and representational similarity analysis (RSA).

Robert then pushed the question further. Temporal precision tells us **when**, but understanding the brain also requires knowing **where**.

Real cognition is never the work of one isolated brain area. Perception, attention, memory, and behavior involve sequential and parallel processing across multiple regions. Every MEG sensor outside the head records a mixture of signals from multiple neural sources.

Robert offered a vivid analogy. Imagine a party where many people are speaking at once. A single microphone in the center of the room records a mixture of every voice. Source reconstruction is like trying to place a microphone in front of each person so that the individual voices can be recovered from the mixture.

This is what it means to **disentangle brain activity**.

## Inferring the brain from its shadow outside the head

Source reconstruction contains two problems that run in opposite directions.

**Forward problem:** Given the location, orientation, and strength of a neural source, a volume conductor model predicts the EEG/MEG spatial pattern it should produce outside the head.

**Inverse problem:** Given the EEG/MEG measured outside the head, what configuration of activity inside the brain produced it?

The difficulty is that the inverse problem is **ill-posed**. The same external magnetic-field pattern may be produced by one dipole or by multiple dipoles with different locations, orientations, and strengths. A deep source and a configuration of more superficial sources can also generate very similar fields outside the head.

MEG source localization therefore has no unique mathematical solution. Additional **assumptions and constraints** are unavoidable.

## Three families of source reconstruction methods—and three sets of assumptions

Robert grouped common approaches into three families.

**1. Single and multiple dipole models**

These methods assume that only a small number of focal cortical sources are active. The location, orientation, and strength of each dipole are adjusted so that the forward model fits the measured data as closely as possible. This family is especially effective for focal activity such as early sensory responses or interictal discharges in epilepsy.

**2. Distributed source models**

Rather than assuming only a few active sources, distributed models place many candidate dipoles across the cortical sheet and estimate the activity at every location. Because there are far more unknowns than sensors, this is an underdetermined problem. Regularization—such as a minimum-norm constraint—is needed to select a comparatively simple solution that can explain the data.

**3. Spatial filtering and beamforming**

A beamformer takes a different approach. It constructs a spatial filter for each candidate location in the brain. By computing a weighted combination of all MEG channels, it aims to preserve the signal from the target location while suppressing contributions from other locations and background activity.

Robert emphasized that beamforming has become a highly effective strategy for MEG source reconstruction, especially for cognitive tasks and oscillatory activity. But it, too, relies on assumptions—for example, that the time series of the target source is not highly correlated with those of other sources.

There is no universally “best” source localization algorithm. The real question is always: **Do the method's assumptions match the experiment and the data?**

## “Our questions are not about the skull. Our questions are about the brain.”

Near the end of the lecture, Robert summarized the purpose of MEG in one direct sentence:

> **“Our questions are not about the skull. Our questions are about the brain.”**

MEG topographies are more focal because magnetic fields are not blurred by the skull in the way EEG potentials are. MEG forward models are also comparatively straightforward to construct. Combined with an individual's anatomical MRI and accurate MEG–MRI coregistration, these properties provide a more natural path from sensor space back to brain space.

This is what makes MEG so attractive. We record signals outside the head, but we want to understand how regions inside the brain work together—in a particular temporal order, through serial and parallel processing—to support perception, cognition, and behavior.

In other words, **MEG is valuable not only for its millisecond temporal resolution, but for its attempt to explain when, where, and through what dynamics the brain processes information.**

## Tools are only the beginning: FieldTrip and an open methodological ecosystem

Robert concluded by introducing several widely used open-source tools for EEG/MEG research, including EEGLAB, FieldTrip, Brainstorm, SPM, and MNE-Python. He and his team have developed FieldTrip for more than two decades.

Unlike software centered on a graphical interface, FieldTrip uses MATLAB scripting. Its learning curve may be steeper, but it allows researchers not merely to run an analysis, but to **look under the hood**—to understand what an algorithm does and extend it for their own scientific questions.

Robert also stressed that different tools have different strengths. Brainstorm offers an accessible GUI, SPM has distinctive capabilities in Bayesian modeling and Dynamic Causal Modeling, and MNE-Python benefits from Python's open ecosystem. For clinical settings, carefully designed and certified commercial software has its own indispensable role.

Methods and tools are never the final goal. What matters is understanding:

- **What did we record?**
- **What did the analysis method do?**
- **What assumptions did it rely on?**
- **How strong an inference about the brain can the data support?**

This may be the most important lesson of the lecture.

---

From a minute neural current to a femtotesla-scale magnetic field outside the head; from one sensor time series to a complex time-frequency representation; and from an external magnetic topography back to the activity of different brain regions—every step in MEG connects neurobiology, physics, mathematical modeling, and cognitive science.

For researchers beginning to work with MEG, the priority may not be to master one particular software package or source reconstruction algorithm. It may be to establish a complete chain of reasoning:

> **Start from the brain and understand the signal;<br>
> start from the signal and choose the analysis;<br>
> start from the analysis and return to the brain.**

This is the direction in which we hope to continue learning and experimenting as our MEG research develops.
