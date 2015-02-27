---
layout: post
title:  "Memoized Hash"
categories: tips
---

A neat example of memoization using everyone's favourite sequence.

<!--more-->

{% highlight ruby %}

fibbonacci = Hash.new do |accumulator, index|
  accumulator[index] = fibbonacci[index - 2] + fibbonacci[index - 1]
end.update(0 => 0, 1 => 1)

fibbonacci[100] # 354224848179261915075

{% endhighlight %}