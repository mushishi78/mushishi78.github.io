---
layout: post
title: 'Attire: Dependency Injection'
categories: tools
---

[Last week](/tools/attire-initialization-and-private-getters), I discussed initializers and private getters, as well as how you might use a little gem I've written called [Attire](https://github.com/mushishi78/attire) as shorthand for declaring them. This week I'm going to expand on this to showcase how to use it for dependency injection.

<!--more-->

Dependency injection is a big term for a fairly straight forward practice. All it means is that instead of hard-coding in objects, some flexibility is added by allowing them to be passed in as an argument. That way, there is always the option of swapping them out for different objects in the future. This helps code become less coupled and can be particularly useful for passing in mock objects for testing.

For example, suppose we had the following class:

{% highlight ruby %}

class DalekCreator
  def create(params)
    return unless DalekValidator.valid?(params)
    dalek = Dalek.create(params)
    DalekPresenter.decorate(dalek)
  end
end

{% endhighlight %}

As you can see, the `DalekValidator`, `Dalek` and `DalekPresenter` classes are all baked in. If we wanted to use a different validator for instance, we'd be out of luck.

Here's the example again, but this time using Attire's `attr_init` to define an initializer that allows dependencies to be passed in.

{% highlight ruby %}

class DalekCreator
  attr_init validator_class: DalekValidator,
            model_class: Dalek,
            presenter_class: DalekPresenter

  def create(params)
    return unless validator_class.valid?(params)
    dalek = model_class.create(params)
    presenter_class.decorate(dalek)
  end
end

creator = DalekCreator.new(validator_class: LenientDalekValidator)
dalek = creator.create(name: 'Kahn')

{% endhighlight %}

The `attr_init` method allows default values for dependencies to be given in easily read, declaritive syntax and custom values to be passed into the constructor via a options hash. Substituting the validator for the `LenientDalekValidator` is no trouble at all.

However there is a caveat, the default values here are evaluated in the class scope. This means that this approach may be more suitable for passing classes as dependencies rather than objects that need to be initialized. Although the default values are dup-ed before being used, it's probably not wise to use it for complex objects.

Here's an alternative approach for dependency injection for more complex objects using a private method to provide the default:

{% highlight ruby %}

class StairsHandler
  attr_init :dalek, policy: nil

  def climb_stairs(floor)
    return unless policy.allow?(:fly)
    dalek.fly_to(floor)
  end

  private

  def policy
    @policy ||= DalekPolicy.new(:exterminate_only)
  end
end

{% endhighlight %}