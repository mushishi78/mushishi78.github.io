---
layout: post
title: 'Attire: Dependency Injection'
categories: tools
---

[Last week](/tools/attire-initialization-and-private-getters), I discussed initializers and private getters, as well as how you might use a little gem I've written called [Attire](https://github.com/mushishi78/attire) as shorthand for declaring them. This week I'm going to expand on this to showcase how to use it for dependency injection.

<!--more-->

Dependency injection is a big term for a fairly straight forward practice. All it means is that instead of hard-coding in objects that you intend to use, you allow them to be passed in as an argument. That way, you'll have the option of swapping them out for different objects later. This helps your code becomes more flexible and less coupled, and can be particularly useful for passing in mock objects for testing.

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

Here's the example again, but this time using Attire's `attr_init` to define a initializer that allows dependencies to be passed in.

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

Thanks to the `attr_init` method, default values for the dependencies are given in easily read, declaritive syntax and custom values can be passed in the `DalekCreator` constructor. As such, substituting the validator for the `LenientDalekValidator` is no trouble at all.

However there is a caveat. As the default values are evaluated in class scope, this is more suitable for passing in classes rather than objects. There are often [good reasons](https://practicingruby.com/articles/unobtrusive-ruby-in-practice) to prefer to passing in objects, though neither should be perscribed as always preferable.



{% highlight ruby %}

class DalekUpdater
  attr_init :dalek, validator: nil, presenter: nil

  def update
    return unless validator.valid?
    dalek.save
    presenter
  end

  private

  def validator
    @validator ||= DalekValidator.new(dalek)
  end

  def presenter
    @presenter ||= DalekPresenter.new(dalek)
  end
end

{% endhighlight %}