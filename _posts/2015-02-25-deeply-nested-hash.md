---
layout: post
title:  "Deeply Nested Hash"
categories: quick_tips
---

If you ever find yourself needing to make deeply nested hash entries, this trick might just come in handy.

<!--more-->

{% highlight ruby %}

nested_hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
nested_hash[:x][:y][:z] = :xyz
nested_hash # {:x=>{:y=>{:z=>:xyz}}}

{% endhighlight %}