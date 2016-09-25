#!/bin/bash
clear screen

# Neue Datei laden
rm /www/janhkrueger/sw-statistik/highscore.html
wget http://scherbenwelten.de/data/backup/highscore.html
eingabedatei=`cat /www/janhkrueger/sw-statistik/highscore.html`

result=$(grep -ob "der.Stunde....................................................................................." /www/janhkrueger/sw-statistik/highscore.html)
erg=$(grep -ob ":" <<< $result)
stringZ=$erg

startpos=${stringZ:0:1}
startpos2=${result:0:startpos}

# Feste laenge
foo=95
mittelpos=`expr "$startpos2" + "$foo"`

stringZ=$eingabedatei
#hier der Anfang des eigentlichen Strings, noch auf 10 Zeichen begrenzt
bla=${stringZ:mittelpos:10}


# Nun das Ende ermitteln
reststring=${stringZ:mittelpos}
erg=$(grep -ob "</td>" <<< $reststring| head -1)

#Pos des ersten </td> nach dem eigentlichem Text:  $erg
endedoppelpunktpos=$(grep -ob ":" <<< $erg)

# Laenge abschneiden
startpos=${endedoppelpunktpos:0:1}
# Konkrete Laenge des eigentlichen Textes
endepos=${erg:0:startpos}

stundentext=${stringZ:mittelpos:endepos}
sql=$stundentext


#echo $sql
mysql -u[USER] -p[PASS] [DBNAME] -B -e "INSERT INTO uselessInformation VALUES (now(), '$sql')"
