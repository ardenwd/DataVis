install.packages("data.table")
library(data.table)

pisa <- fread("R-tutorial/data/region6.csv", na.strings = "")
pisa[CNTRYID == "Mexico" & ST063Q01NA == "Checked"
     ][17:20]

pisa[order(CNTRYID, decreasing = TRUE)
     ][,
       head(CNTRYID)]
print(head(pisa$CNTRYID))

