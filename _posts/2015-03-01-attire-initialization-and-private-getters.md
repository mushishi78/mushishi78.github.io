---
layout: post
title: 'Attire: Initialization and Private Getters'
categories: tools
---

Assigning instance variables from a class's `initialize` method is a fairly common task.

<!--more-->

{% highlight ruby %}

class Fruit
  def initialize(type, colour)
    @type = type
    @colour = colour
  end

  def to_s
    "A #{@colour} #{@type}."
  end
end

{% endhighlight %}

Perhaps less common is the practice of defining private getters to refer to instance variables. However it might be a habbit worth considering, if you haven't already.

Here's that example again with private getters:

{% highlight ruby %}

class Fruit
  def initialize(type, colour)
    @type = type
    @colour = colour
  end

  def to_s
    "A #{colour} #{type}."
  end

  private

  attr_reader :type, :colour
end

{% endhighlight %}

This does introduce a few extra lines but it has its benefits. One of which being that sub-classes can override a getter method without much hassle.

{% highlight ruby %}

class ExtremistFruit < Fruit
  def colour
    @colour == :black ? :black : :white
  end
end

{% endhighlight %}

## Introducing Attire

[Attire](https://github.com/mushishi78/attire) is a small gem I've written to add concision to these declarations. Using it for the `Fruit` example, the class can be shortened like so:

{% highlight ruby %}

require 'attire'

class Fruit
  attr_init :type, :colour

  def to_s
    "A #{colour} #{type}."
  end
end

{% endhighlight %}

It can be used with optional parameters, splats and blocks. If you're interested, make sure you check it out:

[https://github.com/mushishi78/attire](https://github.com/mushishi78/attire)

Next week, I'll be writing a post on how you might use it for dependency injection.