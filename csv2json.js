var request = require("request"),
	iconv = require("iconv-lite"),
	csv = require("csv"),
	JSONStream = require("JSONStream"),
	path = require("path"),
	fs = require("fs");

var columns = [ "ORIGGPCD", "categorie", "id", "libelle", "10110 Sodium (mg/100g)", "10120 Magnésium (mg/100g)", "10150 Phosphore (mg/100g)", "10190 Potassium (mg/100g)", "10200 Calcium (mg/100g)", "10251 Manganèse (mg/100g)", "10260 Fer (mg/100g)", "10290 Cuivre (mg/100g)", "10300 Zinc (mg/100g)", "10340 Sélénium (µg/100g)", "10530 Iode (µg/100g)", "proteines", "25003 Protéines brutes, N x 6_25 (g/100g)", "glucides", "32000 Sucres (g/100g)", "327 Energie, Règlement UE N° 1169/2011 (kJ/100g)", "energie", "33110 Amidon (g/100g)", "332 Energie, N x facteur Jones, avec fibres  (kJ/100g)", "333 Energie, N x facteur Jones, avec fibres  (kcal/100g)", "34000 Polyols totaux (g/100g)", "34100 Fibres (g/100g)", "400 Eau (g/100g)", "lipides", "40302 AG saturés (g/100g)", "40303 AG monoinsaturés (g/100g)", "40304 AG polyinsaturés (g/100g)", "40400 AG 4:0, butyrique (g/100g)", "40600 AG 6:0, caproïque (g/100g)", "40800 AG 8:0, caprylique (g/100g)", "41000 AG 10:0, caprique (g/100g)", "41200 AG 12:0, laurique (g/100g)", "41400 AG 14:0, myristique (g/100g)", "41600 AG 16:0, palmitique (g/100g)", "41800 AG 18:0, stéarique (g/100g)", "41819 AG 18:1 9c (n-9), oléique (g/100g)", "41826 AG 18:2 9c,12c (n-6), linoléique (g/100g)", "41833 AG 18:3 c9,c12,c15 (n-3), alpha-linolénique (g/100g)", "42046 AG 20:4 5c,8c,11c,14c (n-6), arachidonique (g/100g)", "42053 AG 20:5 5c,8c,11c,14c,17c (n-3) EPA (g/100g)", "42263 AG 22:6 4c,7c,10c,13c,16c,19c (n-3) DHA (g/100g)", "51200 Rétinol (µg/100g)", "51330 Beta-Carotène (µg/100g)", "52100 Vitamine D (µg/100g)", "53100 Vitamine E (mg/100g)", "54101 Vitamine K1 (µg/100g)", "54104 Vitamine K2 (µg/100g)", "55100 Vitamine C (mg/100g)", "56100 Vitamine B1 ou Thiamine (mg/100g)", "56200 Vitamine B2 ou Riboflavine (mg/100g)", "56310 Vitamine B3 ou PP ou Niacine (mg/100g)", "56400 Vitamine B5 ou Acide pantothénique (mg/100g)", "56500 Vitamine B6 (mg/100g)", "56600 Vitamine B12 (µg/100g)", "56700 Vitamine B9 ou Folates totaux (µg/100g)", "60000 Alcool (g/100g)", "65000 Acides organiques (g/100g)", "75100 Cholestérol (mg/100g)" ];
var discardedColumns = [ "ORIGGPCD", "10110 Sodium (mg/100g)", "10120 Magnésium (mg/100g)", "10150 Phosphore (mg/100g)", "10190 Potassium (mg/100g)", "10200 Calcium (mg/100g)", "10251 Manganèse (mg/100g)", "10260 Fer (mg/100g)", "10290 Cuivre (mg/100g)", "10300 Zinc (mg/100g)", "10340 Sélénium (µg/100g)", "10530 Iode (µg/100g)", "25003 Protéines brutes, N x 6_25 (g/100g)", "32000 Sucres (g/100g)", "327 Energie, Règlement UE N° 1169/2011 (kJ/100g)", "33110 Amidon (g/100g)", "332 Energie, N x facteur Jones, avec fibres  (kJ/100g)", "333 Energie, N x facteur Jones, avec fibres  (kcal/100g)", "34000 Polyols totaux (g/100g)", "34100 Fibres (g/100g)", "400 Eau (g/100g)", "40302 AG saturés (g/100g)", "40303 AG monoinsaturés (g/100g)", "40304 AG polyinsaturés (g/100g)", "40400 AG 4:0, butyrique (g/100g)", "40600 AG 6:0, caproïque (g/100g)", "40800 AG 8:0, caprylique (g/100g)", "41000 AG 10:0, caprique (g/100g)", "41200 AG 12:0, laurique (g/100g)", "41400 AG 14:0, myristique (g/100g)", "41600 AG 16:0, palmitique (g/100g)", "41800 AG 18:0, stéarique (g/100g)", "41819 AG 18:1 9c (n-9), oléique (g/100g)", "41826 AG 18:2 9c,12c (n-6), linoléique (g/100g)", "41833 AG 18:3 c9,c12,c15 (n-3), alpha-linolénique (g/100g)", "42046 AG 20:4 5c,8c,11c,14c (n-6), arachidonique (g/100g)", "42053 AG 20:5 5c,8c,11c,14c,17c (n-3) EPA (g/100g)", "42263 AG 22:6 4c,7c,10c,13c,16c,19c (n-3) DHA (g/100g)", "51200 Rétinol (µg/100g)", "51330 Beta-Carotène (µg/100g)", "52100 Vitamine D (µg/100g)", "53100 Vitamine E (mg/100g)", "54101 Vitamine K1 (µg/100g)", "54104 Vitamine K2 (µg/100g)", "55100 Vitamine C (mg/100g)", "56100 Vitamine B1 ou Thiamine (mg/100g)", "56200 Vitamine B2 ou Riboflavine (mg/100g)", "56310 Vitamine B3 ou PP ou Niacine (mg/100g)", "56400 Vitamine B5 ou Acide pantothénique (mg/100g)", "56500 Vitamine B6 (mg/100g)", "56600 Vitamine B12 (µg/100g)", "56700 Vitamine B9 ou Folates totaux (µg/100g)", "60000 Alcool (g/100g)", "65000 Acides organiques (g/100g)", "75100 Cholestérol (mg/100g)" ];
var firstLine = true;
var numberColumns = [ "proteines", "glucides", "energie", "lipides" ];

function toNumber(n) {
	return parseFloat(n.replace(",", "."));
}

request({
	url : "https://pro.anses.fr/tableciqual/Documents/CIQUAL2013-Donneescsv.csv"
})
.pipe(iconv.decodeStream("win1252"))
.pipe(csv.parse({
	delimiter : ";",
	columns : columns
}))
.pipe(csv.transform(function(record, callback) {
	if (firstLine) {
		record = null;
		firstLine = false;
	} else {
		discardedColumns.forEach(function(column) {
			delete record[column];
		});
		numberColumns.forEach(function(column) {
			record[column] = toNumber(record[column]);
		});
	}
	callback(null, record);
}))
.pipe(JSONStream.stringify("[", ",", "]"))
.pipe(fs.createWriteStream(path.join(__dirname, "ciqual.json")));