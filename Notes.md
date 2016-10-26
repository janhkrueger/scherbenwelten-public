- [ ] SW - Ältester noch lesbarer Foreneintrag: Der letzte noch im Forum zu lesende Vorschlag im Vorschlagsforum ist "Eigener Avatar" vom am 14.01.04 1:36, geschrieben von "TheUnknownWarrior"



##### SW - Wichtelbevölkerung aus der Statistik lesen: -- Entfernen der unnoetigen Informationen gleich bei den Abfrage

SELECT surveydate, REPLACE(REPLACE(REPLACE(uselessInformationContent,'In den hiesigen Städten hausen ',''),'Wichtel.',''),'.','')  FROM uselessInformation
WHERE uselessInformationContent LIKE ('In den hiesigen Städten hausen % Wichtel%')
