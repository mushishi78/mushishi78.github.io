---
layout: post
title: 'A Case for CMS-Free Ecommerce'
categories: architecture
---

Although we might not often think of them in such terms, at their heart, most ecommerce solutions are also CMSs ([Content Management Systems](http://en.wikipedia.org/wiki/Content_management_system)).

<!--more-->

They typically provide an adminstration panel for store managers with little technical knowledge to enter in various bits of data such as products, delivery rates, promotions...etc These get stored in a relational database, to be requested by the main application that will wrap them up in some template logic to generate webpages on the fly.

These systems are complicated; they require multiple applications, often running on multiple machines, that need to maintain the resources necessary to create pages dynamically for every request received. The journey from server to application to the database and back again exposes multiple points where the whole process can fail.

Whats more, it takes up a lot of physical time. Typically a database is housed in a different machine, for various reasons including maintainability and security, so each request for data is expensive. Minimising the number of requests and the performance of this cycle entails implementing caching schemes at the various endpoints. These schemes have varying reliability and add another layer of complexity.

Admin panels themselves are also a source of complexity. They require authentication and ability management systems to ensure they are only accessed by the right people. When new features are implemented, they often need new admin interfaces to be purpose built, even for fairly mundane data entry needs. And as they aren't customer facing systems, they normally can become fairly neglected in terms of usability.

Given this, it's worth taking the time to re-examine the assumptions these systems are predicated on, and evaluate whether they generate enough value to justify their complexity. This is especially true in the light of a growing abundunce of dedicated external services and the maturity of client-side solutions.

## What's the Alternative?

Instead of having an application listening for page requests and assembling pages in real time, there is the option of going back to how the web was originally envisioned. Where a request for `http://my-shop.com/red-shoes/` was literally a request for the server at the domain `my-shop.com` to serve the `index.html` file from the `red-shoes` folder. That's it. The server doesn't run any code, doesn't request anything from a database, it just serves files unchanged.

However, no-one wants to go back to maintaining static files by hand. So what's required is a *static site generator* that can be run everytime a store manager updates anything. This way a sites structure can still be organised into templates, but they are only ever executed when the data that forms the site's content is updated.

As this data is no longer needed to be accessed in realtime, there's no real concern over memory resources or performance so there's no compelling reason to keep it in a database. Unlike data about customers or customer-generated content, the type of data that gets entered in a backend, typically product data, tends to be edited fairly infrequently by a very small number of people, none of whom are customers. So the life-cycle and storage requirements are much more similar in nature to code repositories than a database, which means there's no reason it can't be put in simple data-files in the same code repository as the templates.

A good example of this architecture can be found in [Jekyll](https://github.com/jekyll/jekyll) projects on [Github Pages](https://pages.github.com/). Github Pages allows free web hosting for any repository that follows a simple naming convention, and if the repository takes the form of a Jekyll project it'll automatically re-compile the site every time a commit is made. Jekyll uses data either given as Yaml meta-data on templates and mark-up files, or as straight data-files in Yaml, JSON or CSV formats. Thus the content of a site can be managed purely by editing data-files in a text editor and making git commits to the repository.

The only problem being that no one expects a non-technical store-manager to be comfortable opening a text editor or a command line. So, a web interface is needed, such as [Prose.io](https://github.com/prose/prose), which replicates the workflow of traditional CMS but commits changes to files directly in a code repository. Prose can be configured to present an interface with specific input types (text, number, checkbox...etc) for meta-data fields and provides handy features such as image uploading and a markdown text editor.

## What About Dynamic Content?

The allusion of the term *static* page is one of limited capabilities, yet this is no longer a fair characterisation. Replacing the features traditionally delivered by "dynamic" pages involves three options:

### 1. Moving it to the client

Anything that doesn't rely on private information stored in a database, or an other similar requirement, can be put on the client. Likely candidates for this includes managing the basket, filtering and searching products, validating forms, suggesting related products, selecting delivery rates...etc As long as you're always aware that anything coming from the client can't be trusted, there's no reason customers shouldn't benefit the speed of keeping these features on their machine.

### 2. Making use of dedicated external services

The modern web is awash with companies providing services that provide a public facing API that are specifically designed for a single task. For any task that can't be trusted to the client, looking for external services is often your next best bet. Storing product photos on a CDN, such as [CloudFare](https://www.cloudflare.com/) and using an analytics service, such as [Google Analytics](www.google.com/analytics/), is fairly common industry practice, but there other services that are often over looked. In particular, external services that handle customer generated content can be a boon to offering dynamic content without taking onboard the burden of managing it. For instance, using a reviews generating service such as [Yotpo](https://www.yotpo.com/), or a customer self-service portal, such as provided by [Zendesk](https://www.zendesk.com/).

### 3. A surporting microservice

In cases where there is no suitable external service exists, or where the service requires the handling of sensitive information, a microservice dedicated to supporting the ecommerce solution will become necessary. The obvious candidate here is the processing of payments: it requires the use of a payment gateway's provided private key but also business logic to check that everything in the requested order adds up. Other things that may require a server side solution include generating coupon codes, sending transaction emails and storing customer details.

The important thing is that any server-side code is wrapped up behind a simple JSON API. It doesn't need to waste any of it's resources on presentation, just a success or fail response with some data. How the front-end deals with that information is part of the "static" domain of the client side code.

It should also be noted that alot of these concerns, that require a server-side solution, can be executed after the customer has clicked the "Purchase" button. This can help maximize conversions because every action the customer takes whilst browsing and filling in forms will be fast, and feel painless.

## Seeing it in Action

I have put together a working solution called [Jekyll-Store](https://github.com/jekyll-store) that serves both as a proof of concept and, hopefully, a starting off point. It is comprised of three parts:

* [Front](https://github.com/jekyll-store/front), static site made with Jekyll and [React](https://github.com/facebook/react) components.

* [Engine](https://github.com/jekyll-store/engine), business logic written with the [RefluxJS](https://github.com/spoike/refluxjs) derivative of the [Flux](https://github.com/facebook/flux) architecture.

* [Microservice](https://github.com/jekyll-store/microservice), for processing payments and sending transactional emails.

There is a fully functioning demo available at:

[www.jekyll-store.com/front/](http://www.jekyll-store.com/front/)

It is hosted entirely for free on Github Pages and [Heroku](https://www.heroku.com/), and together with a few other free services, such as email and image hosting, costs me entirely nothing to upkeep.

Whilst Jekyll-Store feature set is currently modest, it has potential to be as sophisticated as any other solution and at the same time far simpler. It is a perfomant and robust architecture that requires far less in terms of resources and maintaince.

Even if the Jekyll-Store solution doesn't particularly appeal to your business needs, I encourage you to consider a CMS-Free solution for your next web project. It is potentially a disruptive innovation in web development and is deserving of your attention.

For further reading, check out this a great article by Dave Cole:

[How We Build CMS-Free Websites](https://developmentseed.org/blog/2012/07/27/build-cms-free-websites/)
