
# Rabbit Coding Challenge

## Overview

This repository contains the implementation of two key tasks enhancement:

1-Top 10 Most Frequently Ordered Products API: An API that returns the top 10 most frequently ordered products in a specific area.
2-Optimized List Products API: Refactoring and optimizing a poorly implemented /products API to handle large-scale traffic efficiently.
3-Added Order Creation endpoint and implemented Pushover Library for notifications with every order creation.

---
## Project Setup

### 1. **Environment Setup**

- clone the repo
- install dependencies : yarn install
- setup the database :
-   yarn prisma:generate
    yarn migrate:dev
    yarn seed
- Run the server with : nest start

### 2. **Test Cases**

- To run unit tests : yarn jest

## API Implementation 

### Top 10 Most Frequently Ordered Products API
### 1. **Assumptions**
-Assumed that with every request will have the location/area
### 2. **Implementation**
-cached the request for each city with a reasonable time (5 min). when a user requests we check if his city is already in the cache and return the top 10 products otherwise we re query for them. if a request with different city is made we add it to the cache.
### 3. **Optimization and suggestions**

-The time to live can be tuned according to the traffic
-Indexing of columns like customerId can improve query speed 









