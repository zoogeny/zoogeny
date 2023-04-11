# ZDB schema design

A most basic first pass on the design.

Consider the data I want to store:

- A list of things I want
  - products to purchase
  - things to do
- A list of things I have
  - inventory
  - things I have done
- A list of daily activities
  - Food that I eat
  - Exercise that I engage in
  - Work that I have done
  - Personal chores
  - Social engagements
  - Moods
    - happy
    - sad
  - Subjective health
    - headache
    - stomach ache
    - depressed
    - fatigue
  - Sleep schedule
- A list of personal goals
  - Time spent with family/friends
  - Time spent exercising
  - Skills learned / practiced
  - Knowledge learned / memorized
- A personal bio
  - Where I live
  - Where I went to school
  - Personality tests
    - MBTI
  - IQ scores
  - Zodiac / etc.
  - Religious / spiritual / philosophical beliefs
  - Political affiliations

This is a very heterogeneous list of things. Each type of data contains a large amount of potential meta-data.

One issue I am running into is "boiling the ocean". What a hassle to have to handle such a large volume of data all at once. It is impossible. Good luck trying to find some kind of highly-normalized schema to handle such a diverse set of data.

What I want to do is capture the high-level requirement and then break out the sub-level schemas into separate documents.

First idea is to use a large space, like 64 bits, to uniquely identify categories. That give me 1.8×10^19 (over 18 quintillion) different specifiers for each thing. My mind goes to a unicode-like format with blocks associated with particular ideas.

So there would be maybe something like: category, sub-category and sub-sub category. Why 3? I don't know. It seems like a good start. Not sure why I should make it arbitrarily deep. Maybe 2 levels deep is enough. I won't likely have 64 bit worth of top level categories (e.g. want vs. activity vs. bio) so that might just be separate tables.

The question I still can't answer is how deep is the table structure? At some point, the sub-category (or whatever leaf I end up with) is going to be extremely specific to a particular item.

Also how do I consider activities that straddle categories (e.g. work that is also exercise)? On the one hand I can just allow multiple entries for the same timespan. On the other, I can make the timespan the primary object and the activities as contained within it.

## Wants

- General category of want (e.g. want a electric car)
- Options for specific products (e.g. Tesla, Porsche)
  - Cost
  - product features
  - media (e.g. images)
  - links to online stores

## Inventory

- General category of item (e.g. dishwasher)
- Brand
- Model
- Year produced
- Serial number
- Year purchased
- Purchase price
  - receipt
- Warranty information
- Maintenance info
  - schedules for maintenance
  - record of completed maintenance

## Activities

- General category of activity (e.g. snowboarding)
- Start date-time
- End date-time
- Activity specific metadata
- Companions

### Food

- General category of food (e.g. hamburger and fries)
- Ingredients
  - Food nutritional values
    - calories
    - protein
    - fat
    - carbs
    - vitamins / minerals
- Recipe

### Exercise

- General category of exercise (e.g. jogging)
- Bio metrics
  - Heart rate
  - Recovery time
  - Perceived exertion (REP)
  - Respiration rate
- Exercise specific metrics
  - e.g. reps and sets for weight lifting
  - e.g. pace, length, elevation for walking, running, jogging, hiking, bicycling
  - e.g. poses for Yoga

### Work

- General category of work (e.g. programming)
