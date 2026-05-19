// Norwegian postcode register — key entries for dropdown search
// Format: [postcode, city]
// Source: Based on Posten Norway postal register (bring.no)
// For production: import the full register from https://www.bring.no/radgivning/sende-noe/adressetjenester/postnummer

export type PostcodeEntry = [string, string];

export const POSTCODES: PostcodeEntry[] = [
  // ── OSLO (0xxx) ─────────────────────────────────────────────────────────
  ["0010", "Oslo"], ["0015", "Oslo"], ["0021", "Oslo"], ["0025", "Oslo"],
  ["0028", "Oslo"], ["0034", "Oslo"], ["0050", "Oslo"], ["0055", "Oslo"],
  ["0060", "Oslo"], ["0080", "Oslo"], ["0083", "Oslo"], ["0086", "Oslo"],
  ["0150", "Oslo"], ["0151", "Oslo"], ["0152", "Oslo"], ["0153", "Oslo"],
  ["0154", "Oslo"], ["0155", "Oslo"], ["0157", "Oslo"], ["0158", "Oslo"],
  ["0160", "Oslo"], ["0161", "Oslo"], ["0162", "Oslo"], ["0165", "Oslo"],
  ["0168", "Oslo"], ["0170", "Oslo"], ["0172", "Oslo"], ["0175", "Oslo"],
  ["0176", "Oslo"], ["0179", "Oslo"], ["0181", "Oslo"], ["0182", "Oslo"],
  ["0183", "Oslo"], ["0185", "Oslo"], ["0186", "Oslo"], ["0190", "Oslo"],
  ["0191", "Oslo"],
  ["0250", "Oslo"], ["0252", "Oslo"], ["0255", "Oslo"], ["0260", "Oslo"],
  ["0263", "Oslo"], ["0268", "Oslo"], ["0273", "Oslo"], ["0276", "Oslo"],
  ["0278", "Oslo"], ["0280", "Oslo"], ["0282", "Oslo"], ["0283", "Oslo"],
  ["0286", "Oslo"],
  ["0301", "Oslo"], ["0304", "Oslo"], ["0308", "Oslo"], ["0313", "Oslo"],
  ["0315", "Oslo"], ["0316", "Oslo"],
  ["0340", "Oslo"], ["0349", "Oslo"], ["0350", "Oslo"], ["0352", "Oslo"],
  ["0354", "Oslo"], ["0358", "Oslo"], ["0360", "Oslo"], ["0365", "Oslo"],
  ["0366", "Oslo"], ["0368", "Oslo"], ["0369", "Oslo"], ["0371", "Oslo"],
  ["0375", "Oslo"], ["0377", "Oslo"], ["0379", "Oslo"], ["0383", "Oslo"],
  ["0400", "Oslo"], ["0440", "Oslo"],
  ["0450", "Oslo"], ["0460", "Oslo"], ["0462", "Oslo"], ["0465", "Oslo"],
  ["0468", "Oslo"], ["0470", "Oslo"], ["0473", "Oslo"], ["0475", "Oslo"],
  ["0478", "Oslo"], ["0480", "Oslo"], ["0482", "Oslo"], ["0484", "Oslo"],
  ["0486", "Oslo"], ["0490", "Oslo"], ["0491", "Oslo"], ["0493", "Oslo"],
  ["0500", "Oslo"], ["0502", "Oslo"], ["0506", "Oslo"], ["0510", "Oslo"],
  ["0516", "Oslo"], ["0540", "Oslo"], ["0543", "Oslo"],
  ["0550", "Oslo"], ["0553", "Oslo"], ["0555", "Oslo"], ["0558", "Oslo"],
  ["0560", "Oslo"], ["0563", "Oslo"], ["0565", "Oslo"], ["0568", "Oslo"],
  ["0570", "Oslo"], ["0573", "Oslo"], ["0575", "Oslo"],
  ["0580", "Oslo"], ["0582", "Oslo"], ["0585", "Oslo"],
  ["0650", "Oslo"], ["0651", "Oslo"], ["0657", "Oslo"],
  ["0661", "Oslo"], ["0664", "Oslo"], ["0667", "Oslo"],
  ["0670", "Oslo"], ["0671", "Oslo"], ["0675", "Oslo"], ["0678", "Oslo"],
  ["0680", "Oslo"], ["0682", "Oslo"], ["0685", "Oslo"], ["0688", "Oslo"],
  ["0690", "Oslo"], ["0693", "Oslo"], ["0696", "Oslo"], ["0699", "Oslo"],
  ["0750", "Oslo"], ["0752", "Oslo"], ["0755", "Oslo"], ["0758", "Oslo"],
  ["0762", "Oslo"], ["0766", "Oslo"], ["0771", "Oslo"], ["0775", "Oslo"],
  ["0779", "Oslo"], ["0781", "Oslo"], ["0784", "Oslo"], ["0787", "Oslo"],
  ["0850", "Oslo"], ["0852", "Oslo"], ["0855", "Oslo"], ["0858", "Oslo"],
  ["0860", "Oslo"], ["0861", "Oslo"], ["0864", "Oslo"],
  ["0870", "Oslo"], ["0876", "Oslo"], ["0880", "Oslo"], ["0882", "Oslo"],
  ["0891", "Oslo"],
  ["0900", "Oslo"], ["0950", "Oslo"], ["0959", "Oslo"],
  ["0960", "Oslo"], ["0966", "Oslo"], ["0970", "Oslo"], ["0978", "Oslo"],

  // ── AKERSHUS / VIKEN — OSLO SUBURBS (1xxx) ──────────────────────────────
  ["1051", "Oslo"], ["1062", "Oslo"], ["1064", "Oslo"], ["1067", "Oslo"],
  ["1150", "Oslo"], ["1152", "Oslo"], ["1154", "Oslo"], ["1157", "Oslo"],
  ["1160", "Oslo"], ["1162", "Oslo"], ["1165", "Oslo"], ["1168", "Oslo"],
  ["1170", "Oslo"], ["1172", "Oslo"], ["1176", "Oslo"], ["1178", "Oslo"],
  ["1180", "Oslo"], ["1182", "Oslo"], ["1185", "Oslo"], ["1188", "Oslo"],
  ["1190", "Oslo"], ["1191", "Oslo"], ["1192", "Oslo"], ["1196", "Oslo"],
  ["1199", "Oslo"],
  // Bærum
  ["1300", "Sandvika"], ["1301", "Sandvika"], ["1302", "Sandvika"],
  ["1320", "Stabekk"], ["1322", "Høvik"], ["1324", "Lysaker"],
  ["1325", "Lysaker"], ["1327", "Lysaker"], ["1330", "Fornebu"],
  ["1332", "Østerås"], ["1337", "Sandvika"], ["1340", "Skui"],
  ["1342", "Jar"], ["1344", "Haslum"], ["1346", "Gjettum"],
  ["1348", "Rykkinn"], ["1350", "Lommedalen"], ["1351", "Rud"],
  ["1352", "Kolsås"], ["1356", "Bekkestua"], ["1358", "Jar"],
  ["1359", "Eiksmarka"], ["1360", "Nesbru"], ["1362", "Hosle"],
  ["1363", "Høvik"], ["1364", "Fornebu"], ["1365", "Blommenholm"],
  ["1367", "Snarøya"], ["1368", "Stabekk"],
  // Asker
  ["1370", "Asker"], ["1371", "Asker"], ["1372", "Asker"],
  ["1375", "Billingstad"], ["1376", "Billingstad"],
  ["1378", "Nesbru"], ["1379", "Nesbru"],
  ["1380", "Heggedal"], ["1383", "Asker"], ["1384", "Asker"],
  ["1385", "Asker"], ["1388", "Borgen"], ["1390", "Vollen"],
  ["1391", "Vollen"], ["1392", "Vettre"], ["1394", "Nesbru"],
  ["1395", "Hvalstad"], ["1396", "Billingstad"],
  // Follo
  ["1400", "Ski"], ["1401", "Ski"], ["1404", "Siggerud"],
  ["1405", "Langhus"], ["1406", "Ski"], ["1407", "Vinterbro"],
  ["1410", "Kolbotn"], ["1412", "Sofiemyr"], ["1414", "Trollåsen"],
  ["1415", "Oppegård"], ["1420", "Svartskog"],
  ["1430", "Ås"], ["1431", "Ås"], ["1432", "Ås"],
  ["1440", "Drøbak"], ["1441", "Drøbak"],
  ["1450", "Nesoddtangen"], ["1452", "Nesoddtangen"],
  // Lørenskog / Nittedal
  ["1470", "Lørenskog"], ["1471", "Lørenskog"], ["1472", "Fjellhamar"],
  ["1473", "Lørenskog"], ["1474", "Nordbyhagen"],
  ["1476", "Rasta"], ["1477", "Fjellhamar"],
  ["1480", "Slattum"], ["1481", "Hagan"], ["1482", "Nittedal"],
  ["1483", "Hagan"], ["1484", "Rotnes"], ["1485", "Hakadal"],
  // Moss / Rygge
  ["1500", "Moss"], ["1501", "Moss"], ["1502", "Moss"],
  ["1506", "Moss"], ["1510", "Moss"], ["1520", "Moss"],
  ["1530", "Rygge"], ["1540", "Vestby"], ["1545", "Hvitsten"],
  ["1550", "Hølen"], ["1555", "Son"],
  // Fredrikstad
  ["1600", "Fredrikstad"], ["1601", "Fredrikstad"], ["1604", "Fredrikstad"],
  ["1607", "Fredrikstad"], ["1610", "Fredrikstad"], ["1614", "Fredrikstad"],
  ["1621", "Gressvik"], ["1624", "Gressvik"],
  ["1630", "Gamle Fredrikstad"], ["1640", "Råde"],
  ["1650", "Sellebakk"], ["1670", "Kråkerøy"],
  // Sarpsborg
  ["1700", "Sarpsborg"], ["1701", "Sarpsborg"], ["1710", "Sarpsborg"],
  ["1712", "Grålum"], ["1718", "Greåker"], ["1721", "Sarpsborg"],
  ["1725", "Sarpsborg"], ["1730", "Ise"], ["1738", "Borgenhaugen"],
  // Halden
  ["1750", "Halden"], ["1751", "Halden"], ["1760", "Halden"],
  ["1790", "Tistedal"],
  // Askim / Mysen
  ["1800", "Askim"], ["1820", "Spydeberg"], ["1825", "Tomter"],
  ["1830", "Askim"], ["1850", "Mysen"], ["1860", "Trøgstad"],
  ["1870", "Ørje"], ["1890", "Rakkestad"],
  // Romerike east
  ["1900", "Fetsund"], ["1910", "Enebakk"],
  ["1920", "Sørumsand"], ["1930", "Aurskog"],
  ["1940", "Bjørkelangen"], ["1960", "Løken"],
  ["1970", "Hemnes"], ["1980", "Sørumsand"],

  // ── INNLANDET / ROMERIKE (2xxx) ──────────────────────────────────────────
  // Lillestrøm / Skedsmo
  ["2000", "Lillestrøm"], ["2001", "Lillestrøm"], ["2004", "Lillestrøm"],
  ["2010", "Strømmen"], ["2013", "Skjetten"],
  ["2020", "Skedsmokorset"], ["2022", "Gjerdrum"], ["2025", "Fjerdingby"],
  // Jessheim / Gardermoen
  ["2040", "Kløfta"], ["2050", "Jessheim"], ["2051", "Jessheim"],
  ["2054", "Mogreina"], ["2060", "Gardermoen"], ["2066", "Jessheim"],
  // Eidsvoll
  ["2072", "Dal"], ["2074", "Eidsvoll"], ["2080", "Eidsvoll"],
  ["2090", "Hurdal"],
  // Kongsvinger
  ["2100", "Skarnes"], ["2150", "Årnes"], ["2160", "Vormsund"],
  ["2200", "Kongsvinger"], ["2201", "Kongsvinger"], ["2210", "Granli"],
  ["2212", "Kongsvinger"], ["2215", "Roverud"], ["2240", "Magnor"],
  // Hamar
  ["2300", "Hamar"], ["2301", "Hamar"], ["2302", "Hamar"],
  ["2304", "Hamar"], ["2306", "Hamar"], ["2308", "Hamar"],
  ["2315", "Hamar"], ["2317", "Hamar"], ["2318", "Hamar"],
  ["2320", "Furnes"], ["2323", "Ingeberg"], ["2326", "Hamar"],
  // Stange / Løten / Brumunddal
  ["2334", "Stange"], ["2340", "Løten"], ["2341", "Løten"],
  ["2380", "Brumunddal"], ["2381", "Brumunddal"],
  ["2390", "Moelv"], ["2391", "Moelv"],
  // Elverum
  ["2400", "Elverum"], ["2401", "Elverum"], ["2406", "Elverum"],
  ["2408", "Elverum"], ["2411", "Elverum"],
  ["2420", "Trysil"],
  // Tynset / Alvdal
  ["2500", "Tynset"], ["2540", "Tolga"], ["2550", "Os i Østerdalen"],
  ["2560", "Alvdal"], ["2580", "Folldal"],
  // Lillehammer
  ["2600", "Lillehammer"], ["2601", "Lillehammer"], ["2602", "Lillehammer"],
  ["2604", "Lillehammer"], ["2609", "Lillehammer"], ["2610", "Mesnali"],
  ["2615", "Lillehammer"], ["2619", "Lillehammer"], ["2624", "Lillehammer"],
  ["2625", "Fåberg"],
  // Øyer / Ringebu / Vinstra / Otta
  ["2626", "Øyer"], ["2630", "Ringebu"], ["2640", "Vinstra"],
  ["2655", "Otta"], ["2660", "Dombås"], ["2661", "Hjerkinn"],
  // Vågå / Lom / Skjåk
  ["2680", "Vågå"], ["2681", "Lom"], ["2686", "Lom"], ["2690", "Skjåk"],
  // Gran / Lunner
  ["2700", "Gran"], ["2712", "Brandbu"], ["2713", "Roa"],
  ["2714", "Jaren"], ["2716", "Harestua"],
  // Gjøvik
  ["2800", "Gjøvik"], ["2801", "Gjøvik"], ["2802", "Gjøvik"],
  ["2810", "Gjøvik"], ["2815", "Gjøvik"], ["2818", "Gjøvik"],
  ["2821", "Gjøvik"], ["2823", "Raufoss"],
  // Raufoss / Lena / Dokka
  ["2830", "Raufoss"], ["2831", "Raufoss"], ["2836", "Biri"],
  ["2840", "Reinsvoll"], ["2850", "Lena"], ["2860", "Hov i Land"],
  ["2870", "Dokka"], ["2880", "Nord-Aurdal"],
  // Fagernes / Valdres
  ["2900", "Fagernes"], ["2901", "Fagernes"],
  ["2940", "Heggenes"], ["2950", "Kvitfjell"], ["2960", "Røn"],
  ["2970", "Øystre Slidre"],

  // ── VESTFOLD / TELEMARK / NUMEDAL (3xxx) ────────────────────────────────
  // Drammen
  ["3000", "Drammen"], ["3001", "Drammen"], ["3002", "Drammen"],
  ["3003", "Drammen"], ["3004", "Drammen"], ["3006", "Drammen"],
  ["3008", "Drammen"], ["3010", "Drammen"], ["3012", "Drammen"],
  ["3014", "Drammen"], ["3016", "Drammen"], ["3018", "Drammen"],
  ["3021", "Drammen"], ["3024", "Drammen"], ["3026", "Drammen"],
  ["3028", "Drammen"], ["3030", "Drammen"], ["3033", "Drammen"],
  ["3036", "Drammen"], ["3038", "Drammen"],
  ["3040", "Drammen"], ["3043", "Drammen"], ["3045", "Drammen"],
  ["3048", "Drammen"], ["3050", "Mjøndalen"],
  ["3060", "Svelvik"], ["3070", "Sande i Vestfold"],
  ["3080", "Holmestrand"], ["3081", "Holmestrand"],
  // Tønsberg
  ["3110", "Tønsberg"], ["3111", "Tønsberg"], ["3112", "Tønsberg"],
  ["3115", "Tønsberg"], ["3117", "Tønsberg"], ["3118", "Tønsberg"],
  ["3120", "Nøtterøy"], ["3122", "Tønsberg"], ["3125", "Tønsberg"],
  ["3128", "Nøtterøy"], ["3130", "Nøtterøy"], ["3140", "Nøtterøy"],
  ["3150", "Tolvsrød"], ["3160", "Stokke"], ["3165", "Tjøme"],
  // Horten
  ["3181", "Horten"], ["3182", "Horten"], ["3183", "Horten"],
  ["3185", "Skoppum"], ["3187", "Horten"], ["3190", "Horten"],
  ["3195", "Åsgårdstrand"],
  // Sandefjord
  ["3200", "Sandefjord"], ["3201", "Sandefjord"], ["3202", "Sandefjord"],
  ["3205", "Sandefjord"], ["3208", "Sandefjord"], ["3210", "Sandefjord"],
  ["3212", "Sandefjord"], ["3214", "Sandefjord"], ["3216", "Sandefjord"],
  ["3220", "Sandefjord"], ["3222", "Sandefjord"], ["3224", "Sandefjord"],
  // Larvik
  ["3250", "Larvik"], ["3251", "Larvik"], ["3252", "Larvik"],
  ["3255", "Larvik"], ["3257", "Larvik"], ["3260", "Larvik"],
  ["3261", "Larvik"], ["3262", "Larvik"], ["3267", "Larvik"],
  ["3270", "Larvik"], ["3280", "Tjølling"], ["3290", "Stavern"],
  // Hokksund / Numedal
  ["3300", "Hokksund"], ["3320", "Geithus"], ["3330", "Skotselv"],
  ["3370", "Vikersund"], ["3400", "Lier"],
  ["3420", "Lierskogen"], ["3430", "Spikkestad"],
  ["3440", "Røyken"], ["3470", "Slemmestad"],
  ["3480", "Filtvet"], ["3490", "Klokkarstua"],
  // Hønefoss / Ringerike / Numedal
  ["3500", "Hønefoss"], ["3501", "Hønefoss"], ["3503", "Hønefoss"],
  ["3510", "Hønefoss"], ["3514", "Hønefoss"], ["3516", "Hønefoss"],
  ["3520", "Jevnaker"], ["3530", "Røyse"], ["3533", "Tyristrand"],
  ["3540", "Nesbyen"], ["3550", "Gol"], ["3560", "Hemsedal"],
  ["3570", "Ål"], ["3580", "Geilo"], ["3581", "Geilo"],
  // Kongsberg
  ["3600", "Kongsberg"], ["3601", "Kongsberg"], ["3602", "Kongsberg"],
  ["3604", "Kongsberg"], ["3606", "Kongsberg"], ["3608", "Kongsberg"],
  // Notodden / Rjukan
  ["3610", "Notodden"], ["3611", "Notodden"], ["3613", "Notodden"],
  ["3660", "Rjukan"], ["3661", "Rjukan"],
  // Skien
  ["3700", "Skien"], ["3701", "Skien"], ["3702", "Skien"],
  ["3704", "Skien"], ["3706", "Skien"], ["3710", "Skien"],
  ["3711", "Skien"], ["3712", "Skien"], ["3715", "Skien"],
  ["3717", "Skien"], ["3719", "Skien"], ["3720", "Skien"],
  ["3721", "Skien"], ["3722", "Skien"], ["3724", "Skien"],
  ["3725", "Skien"], ["3726", "Skien"], ["3728", "Skien"],
  ["3730", "Skien"], ["3740", "Skien"],
  // Kragerø / Drangedal
  ["3750", "Drangedal"], ["3770", "Kragerø"], ["3787", "Langesund"],
  // Bø / Seljord / Vinje
  ["3800", "Bø i Telemark"], ["3801", "Bø i Telemark"],
  ["3810", "Gvarv"], ["3825", "Lunde"], ["3830", "Ulefoss"],
  ["3840", "Seljord"], ["3848", "Dalen"], ["3880", "Dalen"],
  ["3884", "Rauland"], ["3890", "Vinje"],
  // Porsgrunn / Brevik / Langesund
  ["3900", "Porsgrunn"], ["3901", "Porsgrunn"], ["3902", "Porsgrunn"],
  ["3904", "Porsgrunn"], ["3906", "Porsgrunn"], ["3910", "Porsgrunn"],
  ["3920", "Stathelle"], ["3950", "Brevik"],
  ["3960", "Stathelle"], ["3970", "Langesund"],

  // ── ROGALAND (4xxx) ──────────────────────────────────────────────────────
  // Stavanger
  ["4001", "Stavanger"], ["4004", "Stavanger"], ["4006", "Stavanger"],
  ["4008", "Stavanger"], ["4010", "Stavanger"], ["4012", "Stavanger"],
  ["4014", "Stavanger"], ["4016", "Stavanger"], ["4018", "Stavanger"],
  ["4020", "Stavanger"], ["4022", "Stavanger"], ["4024", "Stavanger"],
  ["4026", "Stavanger"], ["4028", "Stavanger"], ["4030", "Hinna"],
  ["4032", "Stavanger"], ["4034", "Stavanger"], ["4036", "Stavanger"],
  ["4040", "Hafrsfjord"], ["4042", "Hafrsfjord"], ["4044", "Hafrsfjord"],
  ["4050", "Sola"], ["4056", "Tananger"], ["4058", "Tananger"],
  // Jæren / Randaberg
  ["4100", "Jørpeland"], ["4120", "Tau"], ["4130", "Hjelmeland"],
  ["4190", "Randaberg"],
  // Karmøy / Sauda
  ["4200", "Sauda"], ["4250", "Kopervik"], ["4262", "Avaldsnes"],
  ["4270", "Åkrehamn"], ["4280", "Skudeneshavn"],
  // Sandnes
  ["4300", "Sandnes"], ["3301", "Sandnes"], ["4302", "Sandnes"],
  ["4304", "Sandnes"], ["4306", "Sandnes"], ["4308", "Sandnes"],
  ["4310", "Hommersåk"], ["4312", "Sandnes"], ["4314", "Sandnes"],
  ["4316", "Sandnes"], ["4318", "Sandnes"], ["4320", "Sandnes"],
  ["4322", "Sandnes"],
  // Bryne / Egersund
  ["4340", "Bryne"], ["4341", "Bryne"],
  ["4370", "Egersund"], ["4374", "Egersund"],
  // Flekkefjord
  ["4400", "Flekkefjord"], ["4401", "Flekkefjord"], ["4440", "Tonstad"],
  ["4460", "Moi"], ["4480", "Kvinesdal"],
  // Farsund / Lyngdal / Mandal
  ["4550", "Farsund"], ["4580", "Lyngdal"],
  ["4515", "Mandal"], ["4516", "Mandal"], ["4517", "Mandal"],
  // Kristiansand
  ["4600", "Kristiansand"], ["4601", "Kristiansand"], ["4602", "Kristiansand"],
  ["4604", "Kristiansand"], ["4606", "Kristiansand"], ["4608", "Kristiansand"],
  ["4610", "Kristiansand"], ["4612", "Kristiansand"], ["4614", "Kristiansand"],
  ["4616", "Kristiansand"], ["4618", "Kristiansand"],
  ["4620", "Kristiansand"], ["4622", "Kristiansand"], ["4624", "Kristiansand"],
  ["4625", "Flekkerøy"], ["4626", "Kristiansand"],
  ["4628", "Kristiansand"], ["4630", "Kristiansand"], ["4632", "Kristiansand"],
  ["4635", "Kristiansand"], ["4638", "Søgne"], ["4640", "Søgne"],
  // Vennesla / Lillesand / Grimstad
  ["4700", "Vennesla"], ["4720", "Vatne"],
  ["4760", "Birkeland"], ["4770", "Høvåg"],
  ["4790", "Lillesand"], ["4791", "Lillesand"],
  ["4876", "Grimstad"], ["4877", "Grimstad"],
  // Arendal
  ["4801", "Arendal"], ["4815", "Saltrød"],
  ["4817", "His"], ["4818", "Færvik"],
  ["4838", "Arendal"], ["4841", "Arendal"],
  ["4844", "Arendal"], ["4848", "Arendal"],
  // Risør / Tvedestrand
  ["4901", "Tvedestrand"], ["4950", "Risør"],

  // ── VESTLAND / BERGEN (5xxx) ─────────────────────────────────────────────
  // Bergen sentrum
  ["5000", "Bergen"], ["5001", "Bergen"], ["5002", "Bergen"],
  ["5003", "Bergen"], ["5004", "Bergen"], ["5005", "Bergen"],
  ["5006", "Bergen"], ["5007", "Bergen"], ["5008", "Bergen"],
  ["5010", "Bergen"], ["5012", "Bergen"], ["5014", "Bergen"],
  ["5016", "Bergen"], ["5018", "Bergen"], ["5020", "Bergen"],
  ["5031", "Bergen"], ["5034", "Bergen"], ["5036", "Bergen"],
  ["5038", "Bergen"], ["5041", "Bergen"], ["5045", "Bergen"],
  ["5052", "Bergen"], ["5054", "Bergen"], ["5056", "Sandsli"],
  ["5058", "Bergen"],
  // Bergen outskirts
  ["5106", "Øvre Ervik"], ["5116", "Ulset"], ["5121", "Ulset"],
  ["5130", "Nyborg"], ["5141", "Fyllingsdalen"], ["5143", "Fyllingsdalen"],
  ["5145", "Fyllingsdalen"], ["5152", "Bønes"], ["5160", "Laksevåg"],
  ["5162", "Laksevåg"], ["5165", "Laksevåg"], ["5176", "Loddefjord"],
  ["5178", "Loddefjord"], ["5183", "Olsvik"],
  ["5200", "Os i Hordaland"], ["5201", "Os i Hordaland"],
  // Askøy
  ["5300", "Kleppestø"], ["5301", "Kleppestø"], ["5302", "Strusshamn"],
  ["5307", "Ask"], ["5308", "Ask"],
  // Stord
  ["5400", "Stord"], ["5401", "Stord"], ["5402", "Stord"],
  ["5408", "Sagvåg"], ["5410", "Sagvåg"], ["5419", "Fitjar"],
  ["5430", "Bremnes"],
  // Etne / Odda / Rosendal
  ["5460", "Husnes"], ["5470", "Rosendal"], ["5480", "Mundheim"],
  // Haugesund
  ["5500", "Haugesund"], ["5501", "Haugesund"], ["5502", "Haugesund"],
  ["5504", "Haugesund"], ["5506", "Haugesund"], ["5508", "Haugesund"],
  ["5510", "Haugesund"], ["5512", "Haugesund"], ["5514", "Haugesund"],
  ["5516", "Haugesund"], ["5518", "Haugesund"], ["5529", "Haugesund"],
  ["5536", "Haugesund"],
  // Norheimsund / Voss
  ["5600", "Norheimsund"],
  ["5700", "Voss"], ["5701", "Voss"], ["5706", "Voss"],

  // ── MØRE OG ROMSDAL / SOGNEFJORD (6xxx) ─────────────────────────────────
  // Ålesund
  ["6002", "Ålesund"], ["6003", "Ålesund"], ["6004", "Ålesund"],
  ["6006", "Ålesund"], ["6008", "Ålesund"], ["6010", "Ålesund"],
  ["6012", "Ålesund"], ["6014", "Ålesund"], ["6016", "Ålesund"],
  ["6018", "Ålesund"], ["6020", "Ålesund"], ["6022", "Ålesund"],
  ["6024", "Ålesund"], ["6026", "Ålesund"], ["6028", "Ålesund"],
  ["6030", "Langevåg"], ["6040", "Vigra"], ["6050", "Valderøy"],
  ["6060", "Hareid"], ["6065", "Ulsteinvik"],
  ["6080", "Gurskøy"], ["6090", "Fosnavåg"],
  // Ørsta / Stranda
  ["6150", "Ørsta"], ["6152", "Ørsta"], ["6160", "Hovdebygda"],
  ["6200", "Stranda"], ["6210", "Valldal"], ["6230", "Sykkylven"],
  // Åndalsnes
  ["6300", "Åndalsnes"], ["6301", "Åndalsnes"], ["6320", "Isfjorden"],
  // Molde
  ["6400", "Molde"], ["6401", "Molde"], ["6402", "Molde"],
  ["6404", "Molde"], ["6406", "Molde"], ["6408", "Molde"],
  ["6410", "Molde"], ["6413", "Molde"], ["6415", "Molde"],
  ["6422", "Molde"], ["6430", "Bud"], ["6440", "Elnesvågen"],
  // Kristiansund
  ["6501", "Kristiansund"], ["6506", "Kristiansund"],
  ["6508", "Kristiansund"], ["6510", "Kristiansund"],
  ["6514", "Kristiansund"], ["6516", "Kristiansund"], ["6520", "Frei"],
  // Sogndal / Leikanger / Florø
  ["6800", "Førde"], ["6801", "Førde"], ["6803", "Førde"],
  ["6817", "Naustdal"], ["6820", "Førde"],
  ["6856", "Sogndal"], ["6863", "Leikanger"], ["6868", "Gaupne"],
  ["6900", "Florø"], ["6901", "Florø"], ["6902", "Florø"],

  // ── TRØNDELAG / TRONDHEIM (7xxx) ─────────────────────────────────────────
  // Trondheim sentrum
  ["7000", "Trondheim"], ["7003", "Trondheim"], ["7005", "Trondheim"],
  ["7010", "Trondheim"], ["7012", "Trondheim"], ["7014", "Trondheim"],
  ["7016", "Trondheim"], ["7018", "Trondheim"],
  ["7020", "Trondheim"], ["7022", "Trondheim"], ["7024", "Trondheim"],
  ["7026", "Trondheim"], ["7028", "Trondheim"],
  ["7030", "Trondheim"], ["7032", "Trondheim"], ["7034", "Trondheim"],
  ["7036", "Trondheim"], ["7038", "Trondheim"],
  ["7040", "Trondheim"], ["7042", "Trondheim"], ["7044", "Trondheim"],
  ["7046", "Trondheim"], ["7048", "Trondheim"],
  ["7050", "Trondheim"], ["7053", "Ranheim"], ["7055", "Ranheim"],
  ["7057", "Trondheim"], ["7072", "Heimdal"],
  ["7078", "Saupstad"], ["7080", "Heimdal"],
  // Klæbu / Malvik / Melhus
  ["7224", "Melhus"], ["7227", "Melhus"], ["7231", "Lundamo"],
  ["7234", "Ler"], ["7240", "Hitra"],
  // Levanger
  ["7600", "Levanger"], ["7601", "Levanger"], ["7602", "Levanger"],
  ["7604", "Levanger"], ["7620", "Skogn"],
  ["7630", "Åsen"], ["7650", "Verdal"], ["7651", "Verdal"],
  ["7653", "Verdal"], ["7660", "Vuku"],
  ["7670", "Inderøy"],
  // Steinkjer
  ["7700", "Steinkjer"], ["7701", "Steinkjer"], ["7703", "Steinkjer"],
  ["7705", "Steinkjer"], ["7707", "Steinkjer"], ["7710", "Sparbu"],
  ["7715", "Steinkjer"], ["7725", "Steinkjer"], ["7730", "Beitstad"],
  // Namsos
  ["7800", "Namsos"], ["7801", "Namsos"], ["7810", "Namsos"],
  ["7817", "Namdalseid"], ["7820", "Spillum"],
  // Grong / Rørvik
  ["7870", "Grong"], ["7900", "Rørvik"],
  ["7940", "Ottersøy"], ["7970", "Kolvereid"], ["7980", "Leka"],

  // ── NORDLAND (8xxx) ──────────────────────────────────────────────────────
  // Bodø
  ["8001", "Bodø"], ["8003", "Bodø"], ["8005", "Bodø"],
  ["8007", "Bodø"], ["8009", "Bodø"], ["8010", "Bodø"],
  ["8012", "Bodø"], ["8014", "Bodø"], ["8016", "Bodø"],
  ["8018", "Bodø"], ["8020", "Bodø"], ["8022", "Bodø"],
  ["8028", "Bodø"], ["8030", "Bodø"], ["8037", "Bodø"],
  ["8040", "Bodø"], ["8048", "Bodø"], ["8050", "Tverlandet"],
  ["8056", "Saltstraumen"],
  // Svolvær / Lofoten
  ["8300", "Svolvær"], ["8301", "Svolvær"], ["8305", "Svolvær"],
  ["8309", "Kabelvåg"], ["8310", "Kabelvåg"], ["8311", "Henningsvær"],
  ["8314", "Gimsøysand"], ["8315", "Laukvik"], ["8320", "Skrova"],
  // Sortland / Vesterålen
  ["8400", "Sortland"], ["8401", "Sortland"], ["8403", "Sortland"],
  ["8405", "Sortland"], ["8407", "Sortland"], ["8408", "Blokken"],
  ["8410", "Lødingen"], ["8430", "Myre"],
  // Narvik
  ["8500", "Narvik"], ["8501", "Narvik"], ["8502", "Narvik"],
  ["8504", "Narvik"], ["8506", "Narvik"], ["8508", "Narvik"],
  ["8510", "Narvik"], ["8512", "Narvik"], ["8514", "Narvik"],
  ["8516", "Narvik"], ["8519", "Narvik"], ["8522", "Beisfjord"],
  // Mo i Rana
  ["8600", "Mo i Rana"], ["8601", "Mo i Rana"], ["8602", "Mo i Rana"],
  ["8608", "Mo i Rana"], ["8613", "Mo i Rana"], ["8616", "Mo i Rana"],
  ["8619", "Mo i Rana"], ["8622", "Mo i Rana"], ["8626", "Mo i Rana"],
  // Mosjøen
  ["8650", "Mosjøen"], ["8654", "Mosjøen"], ["8656", "Mosjøen"],
  // Sandnessjøen / Brønnøy
  ["8800", "Sandnessjøen"], ["8801", "Sandnessjøen"], ["8805", "Sandnessjøen"],
  ["8808", "Sandnessjøen"], ["8812", "Leirfjord"],
  ["8900", "Brønnøysund"], ["8901", "Brønnøysund"], ["8905", "Brønnøysund"],
  ["8910", "Brønnøysund"], ["8920", "Sømna"], ["8940", "Bindal"],

  // ── TROMS OG FINNMARK (9xxx) ─────────────────────────────────────────────
  // Tromsø
  ["9001", "Tromsø"], ["9006", "Tromsø"], ["9008", "Tromsø"],
  ["9010", "Tromsø"], ["9012", "Tromsø"], ["9014", "Tromsø"],
  ["9016", "Tromsø"], ["9018", "Tromsø"],
  ["9020", "Tromsdalen"], ["9022", "Krokelvdalen"],
  ["9024", "Tomasjord"], ["9027", "Ramfjordbotn"],
  ["9029", "Tromsdalen"], ["9037", "Tromsø"], ["9038", "Tromsø"],
  ["9040", "Nordkjosbotn"], ["9042", "Laksvatn"],
  // Finnsnes / Lenvik
  ["9300", "Finnsnes"], ["9301", "Finnsnes"], ["9303", "Silsand"],
  ["9306", "Finnsnes"], ["9309", "Finnsnes"],
  // Harstad
  ["9400", "Harstad"], ["9401", "Harstad"], ["9402", "Harstad"],
  ["9404", "Harstad"], ["9406", "Harstad"], ["9408", "Harstad"],
  ["9410", "Harstad"], ["9413", "Harstad"], ["9415", "Harstad"],
  ["9418", "Harstad"], ["9420", "Lundenes"],
  // Alta
  ["9500", "Alta"], ["9501", "Alta"], ["9502", "Alta"],
  ["9504", "Alta"], ["9506", "Alta"], ["9508", "Alta"],
  ["9510", "Alta"], ["9513", "Alta"], ["9515", "Alta"],
  ["9518", "Alta"], ["9519", "Alta"],
  // Kautokeino
  ["9520", "Kautokeino"], ["9521", "Kautokeino"],
  // Hammerfest
  ["9600", "Hammerfest"], ["9601", "Hammerfest"], ["9603", "Hammerfest"],
  ["9610", "Rypefjord"], ["9613", "Hammerfest"],
  ["9620", "Kvalsund"],
  // Nordkapp / Karasjok
  ["9730", "Karasjok"], ["9735", "Karasjok"],
  ["9750", "Honningsvåg"], ["9751", "Honningsvåg"],
  ["9770", "Mehamn"],
  // Vadsø / Vardø / Kirkenes
  ["9800", "Vadsø"], ["9801", "Vadsø"], ["9810", "Vadsø"],
  ["9820", "Varangerbotn"], ["9825", "Tana"],
  ["9900", "Kirkenes"], ["9901", "Kirkenes"], ["9902", "Kirkenes"],
  ["9910", "Bjørnevatn"], ["9912", "Hesseng"],
  ["9920", "Neiden"], ["9930", "Nesseby"],
  ["9940", "Gamvik"],
  ["9950", "Vardø"], ["9970", "Båtsfjord"],
  ["9980", "Berlevåg"], ["9990", "Båtsfjord"],
];
