---
status: in-progress
featured: true
title: "Wine Grape Climate Suitability Model"
description: "End-to-end ML pipeline predicting wine grape varietal suitability from regional climate data. Processed 143,000+ wine records and 60+ years of weather data (1961-2016)."
longDescription: "Built custom Selenium scraper to supplement Kaggle datasets with Wine Enthusiast ratings. Engineered seasonal climate features aligned with vine growth cycles (budburst, flowering, veraison, harvest). Achieved 56% accuracy using H2O AutoML Distributed Random Forest across 19-class imbalanced dataset. Deployed as Flask web application with location-based prediction interface. Currently rebuilding with cleaner data sources, modular architecture, and Gradio for improved production readiness and accuracy."
tags: ["Python", "H2O AutoML", "scikit-learn", "Flask", "Selenium", "SMOTE"]
link: "https://github.com/georgejieh/predicting_grape_suitability_based_on_climate_and_precipitation"
repo: "https://github.com/georgejieh/predicting_grape_suitability_based_on_climate_and_precipitation"
sortOrder: 2
---