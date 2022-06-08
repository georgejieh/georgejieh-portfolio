# George Jieh's Data Analytics Portfolio
A page to compile all data analytics case studies that I have completed so far.

## [Project 1 - Google Data Analytics Case Study 1: How Does a Bike-Share Navigate Speedy Success?](https://github.com/georgejieh/bikeshare-analysis)
![alt text](https://i.imgur.com/trZS04H.png)

#### General Project Overview

* Apply Google's ask, prepare, process, analyze, share, and act framework to approach the project and outline the final report.
* Identify the business task and present a clear statement with consideration of key stakeholders.
* Utilized various Excel functions to check data for errors as well as transform the data to be utilitzed.
* Aggregate data to perform various statistical calculations. (i.e. average and max ride length based on membership choice, season of year, month of year, and day of the week)
* Identify trends and relationship to describe differences and similaries of bike-share usage between members and non-members using Excel, SQL, and R.
* Create effective data visualizations with Tableau.
* Employ git to document project process, manage project directory and push repository onto github for easy sharing.
* Utilize Markdown to write a report and present findings.

#### Summary of Conclusions

From our analysis we an see that annual members utilize cyclistic's services at a much more even and regular frequency than casual riders. It suggests that annual members tends to have some type of daily errands, possibly commute to work, that requires or encourages them to ride around 10 minutes each trip per day.  The possibility of members utilizing the service for very specific purposes is collaborated by the fact that any one instance of bike rental by members will never go over 24 hours, while casual riders sometimes take a bike out for multiple days or even a month without returning. Casual riders tend to ride for leisure. The number of trips and length of trips increases and decreases when going in and out of the weekends. As previously mentioned, they also have the tendency of renting a bike for long period of time as though they were renting it because they are on a extended vacation. These trends are corrobrated by the following SQL and it's results as well as the following charts and graphs:

```sql
SELECT ti.day_of_week, t.member_casual, 
	AVG(ti.ride_length) as avg_ride_length,
	median(ti.ride_length) as median_ride_length,
	MAX(ti.ride_length) as maximum_ride_length
FROM ride_types t
JOIN ride_times ti ON t.ride_id = ti.ride_id
GROUP BY ti.day_of_week, t.member_casual
ORDER BY ti.day_of_week, t.member_casual;
```

| Day of the Week | Average Member Ride Length | Average Casual Ride Length | Median Member Ride Length | Median Casual Ride Length | Max Member Ride Length | Max Casual Ride Length |
| --------------- | -------------------------- | -------------------------- | ------------------------- | ------------------------- | ---------------------- | ---------------------- |
| Sunday          | 948 Seconds                | 2374 Seconds               | 621 Seconds               | 1047 Seconds              | 89995 Seconds          | 2137331 Seonds         |
| Monday          | 865 Seconds                | 1717 Seconds               | 558 Seconds               | 893 Seconds               | 89995 Seconds          | 444809 Seconds         |
| Tuesday         | 802 Seconds                | 1608 Seconds               | 546 Seconds               | 835 Seconds               | 89993 Seconds          | 372832 Seconds         |
| Wednesday       | 800 Seconds                | 1585 Seconds               | 554 Seconds               | 794 Seconds               | 89990 Seconds          | 975130 Seconds         |
| Thursday        | 785 Seconds                | 1720 Seconds               | 538 Seconds               | 782 Seconds               | 89996 Seconds          | 2498731 Seconds        |
| Friday          | 817 Seconds                | 1977 Seconds               | 553 Seconds               | 824 Seconds               | 89996 Seconds          | 2866602 Seconds        |
| Saturday        | 928 Seconds                | 1975 Seconds               | 651 Seconds               | 1015 Seconds              | 89994 Seconds          | 412689 Seconds         |

![img](https://i.imgur.com/mgRo4Mu.png)

![img](https://i.imgur.com/Y4U3jHY.png)

After finding out about the aforementioned trend, since our goal is to convert casual riders to annual members, I've started investigating to see if there were any instances in behaviour among casual riders that show similarities to annual members. This lead to the following Tableau [dashboard](https://public.tableau.com/app/profile/george.jieh/viz/GoogleDataAnalyticsCase1ConsolidatedVisuals/Dashboard1):

![img](https://i.imgur.com/7TlIjsu.png)

From here we can see that within casual riders, people that ride during weekdays on classic bikes and people that ride during the winter and spring on classic bikes tends to behave like annual members. 

There are limitations with this analysis that is caused by the limitations of the data provided. Though the bikes are equipped with GPS tracking, the data doesn't provide information regarding the path each trip took. This can let us know the purpose behind each trip. The data also doesn't record which trip is taken by which user, so there is no way to really confirm if annual members are really using the bikes for commutes during weekdays, or each member only rides the bike once or twice a week, but there are enough members so the trips are ends up being evenly spreadout throughout the week. 

With what we could work with, the recommendation provided to Cyclistic is to come up with a marketing campaign that specifically targets the following individuals:

- People that ride during weekdays and on classic bikes.
- People that ride during winter and spring on classic bikes.

Examples provided were annual membership discounts during winter and spring or targeted annual membership advertising for individuals that have a record of riding on weekdays.

## [Project 2 - Google Data Analytics Case Study 2: How Can a Wellness Technology Company Play It Smart?](https://github.com/georgejieh/bellabeat-analysis)

![img](https://i.imgur.com/0Dtva0S.png)

#### General Project Overview

* Apply Google's ask, prepare, process, analyze, share, and act framework to approach the project and outline the final report.
* Identify the business task and present a clear statement with consideration of key stakeholders.
* Present business questions to be answered by the analytics.
* Aggregate data to perform various statistical calculations. (i.e. average and max ride length based on membership choice, season of year, month of year, and day of the week)
* Identify trends and relationship to describe user habits of health tracking devices using SQL, and R.
* Create effective data visualizations with Tableau.
* Employ git to document project process, manage project directory and push repository onto github for easy sharing.
* Utilize Markdown to write a report and present findings.

#### Summary of Conclusions

In this analysis we primarily used SQL and R to manipulate and analyze the data because of how the data is presented. The data have heavy limitations from it's small sample size. The data is collected from 30 individuals and not all tables provided have all 30 individuals in it, for example the weight table only contains data from 8 individuals. Because of the limitations, it is difficult to definitively come up with any conclusion on trends, however there is still enough data to make an educated guess. 

