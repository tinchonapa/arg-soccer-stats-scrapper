## :argentina::soccer: Argentinean Soccer League Stats Scrapper :argentina::soccer:

Steps to run the application smoothly:
1. Requires packages: chromedriver:^81.0.0, fs:0.0.1-security, selenium-webdriver:^4.0.0-alpha.7
2. Run npm install in terminal to install
3. Run node ./index.js to retrieve teams first. The file with teams that creates it is used to navigate to different teams while retrieving players data.
4. Run node ./playerScrapper.js to retrieve players personal data (name, height, weight, position, dob)
5. Run node ./statsScrapper.js to retrieve data accumulated on each game they played.

### Goalie Stats Notes
SP Acr | Spanish Def | English Def | ENG Acr 
-------- | ------------------ | ---- | ----
PJ	| Partidos jugados | Games Played | GP
Min	| Minutos | Minutes | MIN
GR	| Goles recibidos | Goals Conceded | GC
PGR	| Promedio de goles recibidos | Goals Against Average | GAA
PO	| Penales otorgados | Penalties Given | PG
PC	| Penales contra | Penalties Against | PA
%PP	| Promedio de penales parados | Penalty Kicks Saves Average | PKSA
Par	| Paradas | Saves | SAVES
TRec |	Tiros recibidos | Shots | SHOTS
TGR | Tiros a gol recibidos | Shots On Goal | SOG
%Par |	Porcentaje de paradas | Shots Save Average | SSA
SRG	| Sin recibir gol | Clean Sheets | CS
TA	| Tarjetas amarillas | Yellow Cards | YC
TR	| Tarjetas rojas | Red Cards | RC

### Players Stats Notes
SP Acr | Spanish Def | English Def | ENG Acr 
----|----|----|----
PJ	| Partidos jugados | Games Played | GP
Min	| Minutos | Minutes | MIN
G	| Goles | Goals | G
PG	| Pases de gol | Assists | A
PA	| Penales anotados | Penalty Kicks Scored |PKS
T	| Tiros | Shots | SHOTS
TG	| Tiros a gol | Shots on Target | SOT
%TG	| Promedio de tiros a gol | Shots on Target Average | SOTA
TA	| Tarjetas amarillas | Yellow Cards | YC
TR	| Tarjetas rojas | Red Cards | RC
F	| Faltas cometidas | Fouls Committed | FC
FR	| Faltas recibidas | Fouls Suffered | FS
Ce	| Centros | Crosses | CROSSES
FL	| Fuera de Lugar | Offsides | OF

Data scraped comes from statsperform,com, and it is use soledly for educational purposes.