---
status: in-progress
featured: true
title: "Wine Grape Climate Suitability Model"
description: "End-to-end ML pipeline predicting wine grape varietal suitability from regional climate data. Processed 143,000+ wine records and 60+ years of weather data (1961–2016), with a working Flask prediction interface."
longDescription: "Built a custom Selenium scraper to supplement Kaggle datasets with Wine Enthusiast ratings. Engineered seasonal climate features aligned with vine growth cycles — budburst, flowering, veraison, harvest. Reached 56% accuracy with H2O AutoML Distributed Random Forest on a 19-class imbalanced dataset, roughly 10x the random baseline, and documented the data quality limits that cap it. Currently being rebuilt: production-quality modular codebase, better data sourcing and cleaning for a more reliable model, and a Gradio interface."
tags: ["Python", "H2O AutoML", "scikit-learn", "Flask", "Selenium", "SMOTE"]
link: "https://github.com/georgejieh/predicting_grape_suitability_based_on_climate_and_precipitation"
repo: "https://github.com/georgejieh/predicting_grape_suitability_based_on_climate_and_precipitation"
sortOrder: 2
---
