install.packages("tidyverse")
library(tidyverse)
install.packages("devtools")
library(devtools)
install.packages("readxl")
library("readxl")
install.packages("data.table")
library(data.table)
# xls files

#this makes a vectotr of all the sheets
path <- "./react-setup/my-react-project/src/langs.xlsx"
# path|>
# excel_sheets()|>
# set_names()|>
# map(read_excel, path =path) |>
# list_rbind()

#make an object that holds worksheet names
sheets <- excel_sheets(path)

data <- read_excel(path, sheets[3])

data
# sheet_names
# my_data <- read_excel("langs.xls")

