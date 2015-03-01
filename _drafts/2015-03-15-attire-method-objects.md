---
layout: post
title: 'Attire: Method Objects'
categories: tools
---



<!--more-->


https://github.com/RetroMocha/obvious/blob/master/lib/obvious/contract.rb


{% highlight ruby %}

class Hash
  # Checks if a hash has a certain structure.
  #     h = { k1: 1, k2: "1" }
  #     h.has_shape?(k1: Fixnum, k2: String)
  #     #=> true
  #     h.has_shape?(k1: Class, k2: String)
  #     #=> false
  # It also works with compound data structures.
  #     h = { k1: [], k2: { k3: Struct.new("Foo") } }
  #     shape = { k1: Array, k2: { k3: Module } }
  #     h.has_shape?(shape)
  #     #=> true
  def has_shape?(shape, return_field = false)
    return_value = lambda { |r, f|
      if return_field
        return r, f
      else
        return r
      end
    }

    # I added an empty check
    if self.empty?
      return return_value.call shape.empty?, nil
    end

    self.each do |k, v|
      return return_value.call false, k if shape[k] == nil
    end

    shape.each do |k, v|
      # hash_value
      hv = self[k]
      return return_value.call false, k unless self.has_key? k

      next if hv === nil

      if Hash === hv
        return hv.has_shape?(v, return_field)
      else
        return return_value.call false, k unless v === hv
      end
    end

    return_value.call true, nil
  end
end

{% endhighlight %}


{% highlight console %}

C: Assignment Branch Condition size for has_shape? is too high. [19.42/15]
C: Cyclomatic complexity for has_shape? is too high. [8/6]
C: Method has too many lines. [24/10]
C: Perceived complexity for has_shape? is too high. [10/7]

{% endhighlight %}


{% highlight ruby %}

require 'attire'

class ShapeChecker
  attr_method :has_shape?, :hash, :shape, :'return_field = false'

  def has_shape?
    result = empty_check || keys_check || shape_check || [true, nil]
    return_field ? result : result.first
  end

  private

  def empty_check
    [shape.empty?, nil] if hash.empty?
  end

  def keys_check
    hash.each { |k, _| return [false, k] if shape[k].nil? }
    nil
  end

  def shape_check
    shape.each do |k, v|
      return [false, k] unless hash.key?(k)
      next if hash[k].nil?
      return ShapeChecker.has_shape?(hash[k], v, true)
      return [false, k] unless hash[k].is_a?(v)
    end
    nil
  end
end

class Hash
  def has_shape?(shape, return_field = false)
    ShapeChecker.has_shape?(self, shape, return_field)
  end
end

{% endhighlight %}


[Better solution](https://gist.github.com/mushishi78/f87aefaccbc934d57064)