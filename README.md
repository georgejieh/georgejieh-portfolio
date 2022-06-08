# George Jieh's Data Analytics Portfolio
A page to compile all data analytics case studies that I have completed so far.

#### Table of Contents

- TOC
{:toc}


## [Project 1 - Google Data Analytics Case Study 1: How Does a Bike-Share Navigate Speedy Success?](https://georgejieh.github.io/bikeshare-analysis/)
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

## [Project 2 - Google Data Analytics Case Study 2: How Can a Wellness Technology Company Play It Smart?](https://georgejieh.github.io/bellabeat-analysis/)

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

With SQL we tried to figure out the algorithm behind how the tracker manages to come up with the amount of calories burned. We were unable to come up with anything conclusive. There are two primary ways for burned calories to be calulated, one is through the use of METs and the other is through heart rate. The METs method doesn't apply to this data set because the METs data presented by the tables are not the same as the standard metrics. The heart rate method is of the highest possibility, however there is no evidence of all user's weight and age is actively tracked. Despite this, from the statistical analysis done in SQL we were able to start seeing a lack of correlation between number of steps taken per day and calories burned. This is further emphasized by the following graph:

![img](https://i.imgur.com/kLY8ssS.png)

We can see that the more active someone is, the more steps they will take per day. So there is a positive relationship in that sense, but we don't see an obvious gradient where the dots becoming lighter in color, more calories burned, the more we go towards the top left. This chart further emphasizes this insight:

![img](https://i.imgur.com/fgw22MI.png)

Though the trend line does show that the longer someone is active the more calories are burned. However, this is not as obvious of a positive correlation as it was between number of steps per day and minutes active per day. There is obviously two clusters of similar size that is located both below and above the trend line. Meaning at any amount of daily activity, there can be significant differences between calories burned. The next two charts shows why:

![img](https://i.imgur.com/PWbbbhG.png)

![img](https://i.imgur.com/zOI3rSR.png)

Since the data on average rarely have people spent more than 50% of their active time exericising, so it isn't super obvious, but we can still tell that a lot of the dots above the trend line have some level of time spent exercising, while most dots below the trend line primarily just do light activities. From this we an tell that the amount of time spent being active, also indirectly infers the amount of steps taken per day, is not as important for burning calories than what you are actually doing when you are being active or taking those steps. 

This insight leads to an important discovery that plays a part in the final marketing proposal of this project. From the data we were able to find out that people that are considered healthy tends to behave as though they are trying to meeting the recommended quotas to maintain a healthy lifestyle, while people that are overweight tends to behave as though they are on a weight loss program. This is revealed by the following density charts:

![img](https://i.imgur.com/YkhkkyU.png)

![img](https://i.imgur.com/TL4MBWm.png)

![img](https://i.imgur.com/yPAwKQC.png)

![img](https://i.imgur.com/B6rqcbG.png)

From these charts, we see that both healthy and overweight individuals tends to share a similar amount of time active, however overweight individuals lean towards a higher amount of calories burned per day than healthy individuals. We can see that healthy individual's density curve peaks just above 2000 calories burned per day, while overweight individuals peak around 3750 calories burned per day. This is possible because, statistically speaking, overweight individuals in this data set spends more time exerising and less time only being lightly active when compared to healthy individuals. The aforementioned trend is further emphasized by the following graph:

![img](https://i.imgur.com/DxELZco.png)

By using box plots in Tableau, we see that there isa much larger spread when it comes to daily calories burned for overweight individuals than healthy individuals. Another interesting insight found using Tableau, is that it shows people that are Obese and some of the people that are slightly overweight tends to not actively report their weight data, while people that are overweight and approaching being obese, and people that are healthy do actively report their weight data. You an see the Tableau dashboard below and the Tableau public link [here](https://public.tableau.com/app/profile/george.jieh/viz/GoogleDataAnalyticsCase2/Dashboard1):

![img](https://i.imgur.com/91MiWAv.png)

From our analysis we can draw a number of conclusions, such as exercising more burns more calories, not all types of activities are created equal when it comes to losing weight, and calories burned doesn't have a obvious direct correlation with the numbers of steps you take in a day. However none of these conclusions is as important as the tracker usage trends discovered for healthy individuals and overweight individuals. 

With these two trends there are targeted marketing opportunities. To target the overweight public that wants to lose weight, there can be marketing done with weight loss in mind, while for the healthy public, the products can be marketed as something that helps you keep track and make sure you are meeting your doctors recommendations.
