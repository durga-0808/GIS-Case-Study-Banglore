import React from 'react';
import { PieChart, Pie, Cell, Tooltip, } from 'recharts';

const TREE_COLORS = {
    "Acacia Auriculiformis Cunn. Ex Benth": "rgb(195, 34, 34)",
    "Acacia Catechu (L. F.) Wild.": "rgb(201, 42, 34)",
    "Acacia Chundra (Roxb. Ex Rottl.)": "rgb(206, 51, 34)",
    "Acacia Leucophloea (Roxb.) Wild": "rgb(212, 60, 33)",
    "Acacia Nilotica (L.) Del. Subsp. Indica (Benth.) Brenan": "rgb(217, 69, 32)",
    "Adenanthera Pavonina L.": "rgb(223, 80, 32)",
    "Aegle Marmelos (L.) Corr. Serr.": "rgb(225, 92, 35)",
    "Ailanthus Triphysa (Dennst.) Alston": "rgb(227, 104, 38)",
    "Albizia Lebbeck (L.) Benth.": "rgb(229, 116, 42)",
    "Albizia Odoratissima (L.F.) Bent": "rgb(230, 128, 45)",
    "Aleurites Moluccana (L.) Wild.": "rgb(232, 140, 48)",
    "Alstonia Macrophylla Wall. Ex Dc.": "rgb(234, 152, 52)",
    "Alstonia Scholaris (L.) R. Br.": "rgb(235, 163, 55)",
    "Anacardium Occidentale L.": "rgb(237, 175, 59)",
    "Annona Cherimola Mill.": "rgb(238, 186, 63)",
    "Annona Reticulata L.": "rgb(240, 196, 66)",
    "Annona Squamosa L": "rgb(241, 207, 70)",
    "Aphanamixis Polystachya (Wall.)": "rgb(242, 217, 74)",
    "Araucaria Columnaris": "rgb(244, 227, 78)",
    "Artocarpus Altitilis (Park.) Fosb.": "rgb(245, 237, 81)",
    "Artocarpus Heterophyllus Lam.": "rgb(246, 246, 85)",
    "Artocarpus Hirsutus Lam.": "rgb(239, 247, 89)",
    "Averrhoa Carambola L.": "rgb(233, 248, 93)",
    "Azadirachta Indica A. Juss.": "rgb(227, 249, 98)",
    "Barringtonia Acutangula (L.)": "rgb(221, 250, 102)",
    "Barringtonia Asiatica (L.) Kurz": "rgb(215, 251, 106)",
    "Bauhinia Blakeana Dunn": "rgb(209, 252, 110)",
    "Bauhinia Forficata": "rgb(204, 253, 114)",
    "Bauhinia Galpinii N.E. Br.": "rgb(200, 254, 119)",
    "Bauhinia Purpurata (Vieill.)": "rgb(195, 254, 123)",
    "Bauhinia Purpurea L.": "rgb(191, 236, 147)",
    "Bauhinia Racemosa Lam": "rgb(189, 237, 150)",
    "Bauhinia Tomentosa L.": "rgb(188, 239, 154)",
    "Bauhinia Variegata L.": "rgb(187, 240, 158)",
    "Bauhinia Variegata L. Var. Candida Voigt.": "rgb(186, 241, 162)",
    "Bombax Malabaricum Dc": "rgb(72, 201, 29)",
    "Brassaia Actinophylla Endl. Var. Capitata Clarke": "rgb(64, 206, 28)",
    "Broussonetia Luzonica Bureau": "rgb(55, 212, 28)",
    "Broussonetia Papyrifera Vent": "rgb(46, 218, 27)",
    "Butea Monosperma (Lam.) Taub": "rgb(36, 224, 26)",
    "Caesalpinia Ferrea Mart. Ex Tul.": "rgb(25, 230, 25)",
    "Calamus Prasinus Lak. & Renuka": "rgb(29, 231, 39)",
    "Callistemon Viminalis (Soland. Ex Gaertn.) G. Don": "rgb(32, 233, 52)",
    "Calophyllum Inophyllum L": "rgb(36, 235, 66)",
    "Cananga Odorata (Lam.) Hook.F. & Thoms.": "rgb(39, 236, 79)",
    "Caryota Mitis Lour.": "rgb(43, 238, 91)",
    "Caryota Urens L": "rgb(46, 239, 104)",
    "Cassia Fistula": "rgb(50, 241, 117)",
    "Cassia Fistula L.": "rgb(54, 242, 129)",
    "Cassia Grandis L.F": "rgb(57, 243, 141)",
    "Cassia Javanica L.": "rgb(61, 245, 153)",
    "Cassia Moschata Kunth": "rgb(65, 246, 165)",
    "Cassia Roxburghii Dc.": "rgb(69, 247, 176)",
    "Cassia Spectabilis Dc.": "rgb(73, 248, 187)",
    "Cassine Paniculata (Wight & Arn.)": "rgb(77, 249, 198)",
    "Castanospermum Australe Cunn. & Fraser": "rgb(81, 251, 208)",
    "Casuarina Equisetifolia L.": "rgb(85, 252, 218)",
    "Cedrela Odorata L": "rgb(89, 252, 228)",
    "Ceiba Pentandra (L.) Gaertn.": "rgb(93, 253, 237)",
    "Ceiba Speciosa (A. St. Hil.) Ravenna": "rgb(98, 254, 246)",
    "Centrolobium Microchaete (Mart. Ex Benth.)": "rgb(125, 232, 232)",
    "Chukrasia Tabularis A. Juss.": "rgb(129, 228, 234)",
    "Cinnamomum Verum J.S. Presl": "rgb(132, 225, 235)",
    "Cirtus Grandis (L.) Osbeck": "rgb(136, 221, 236)",
    "Citharexylum Fruticosum L.": "rgb(140, 218, 238)",
    "Clusia Rosea Jacq.": "rgb(143, 215, 239)",
    "Cochlospermum Religiosum (L.)": "rgb(147, 212, 240)",
    "Cocos Nucifera L.": "rgb(151, 210, 242)",
    "Cordia Lutea Lam.": "rgb(155, 208, 243)",
    "Cordia Wallichii G. Don": "rgb(159, 206, 244)",
    "Couroupita Guianensis Abul.": "rgb(23, 115, 207)",
    "Crescentia Cujete L.": "rgb(22, 108, 212)",
    "Cyrtostachys Renda Blume": "rgb(22, 100, 218)",
    "Dalbergia Latifolia Roxb.": "rgb(21, 92, 224)",
    "Dalbergia Sissoo Roxb.": "rgb(20, 83, 230)",
    "Delonix Regia (Bojer Ex Hook.) Raf.": "rgb(19, 73, 236)",
    "Dillenia Indica L": "rgb(23, 66, 238)",
    "Diospyros Cordifolia Roxb.": "rgb(26, 58, 239)",
    "Diospyros Ebenum Koenig.": "rgb(30, 51, 241)",
    "Diospyros Melanoxylon Roxb.": "rgb(33, 44, 242)",
    "Drypetes Roxburghii (Wall.) Hurus": "rgb(37, 37, 244)",
    "Duadanga Grandiflora (Roxb. Ex Dc.) Walp.": "rgb(51, 41, 245)",
    "Dypsis Lutescens (Wendl.) Beentze & Dransfield": "rgb(65, 44, 246)",
    "Elaeocarpus Grandis F. Muell.": "rgb(78, 48, 248)",
    "Emblica Officinalis Gaertn.": "rgb(91, 52, 249)",
    "Enterolobium Contortisiliqum (Vell.)": "rgb(105, 56, 250)",
    "Eriobotrya Japonica (Thunb.) Lindley": "rgb(117, 60, 251)",
    "Erythina Standleyana Krukoff": "rgb(130, 64, 252)",
    "Erythrina Suberosa Roxb.": "rgb(142, 68, 253)",
    "Erythrina Umbrosa Kunth": "rgb(154, 72, 254)",
    "Erythroxylum Monogynum Roxb.": "rgb(166, 103, 228)",
    "Eucalyptus Tereticornis Sm.": "rgb(174, 107, 230)",
    "Eugenia Uniflora L": "rgb(183, 110, 231)",
    "Ficus Auriculata Lour.": "rgb(191, 114, 233)",
    "Ficus Benghalensis L.": "rgb(199, 117, 234)",
    "Ficus Benjamina L.": "rgb(207, 121, 236)",
    "Ficus Elastica Roxb. Ex Hornem": "rgb(215, 125, 237)",
    "Ficus Infectoria Sensu Roxb. – Type 1": "rgb(222, 129, 239)",
    "Ficus Infectoria Sensu Roxb.-Type Ii": "rgb(229, 132, 240)",
    "Ficus Pandurata Hance": "rgb(236, 136, 241)",
    "Ficus Racemosa L.": "rgb(242, 140, 242)",
    "Ficus Religiosa L.": "rgb(243, 144, 238)",
    "Ficus Virens Aiton (Ficus Infectoria Sensu Roxb. -Type Iii)": "rgb(244, 148, 235)",
    "Filicium Decipiens (Wt. & Arn.)": "rgb(245, 152, 231)",
    "Firmiana Colorata (Roxb.) R. Br.": "rgb(246, 156, 228)",
    "Flacouratia Inermis Roxb.": "rgb(212, 17, 164)",
    "Garcinia Indica (Thouars) Choisy": "rgb(218, 16, 158)",
    "Gliricidia Sepium": "rgb(224, 16, 151)",
    "Gmelina Arborea Roxb.": "rgb(230, 15, 144)",
    "Grevillea Robusta Cunn. Ex R. Br.": "rgb(236, 14, 136)",
    "Grewia Asiatica Sensu Masters": "rgb(242, 13, 128)",
    "Guazuma Ulmifolia Lam": "rgb(244, 16, 119)",
    "Heritiera Littoralis Dyrand.": "rgb(245, 20, 110)",
    "Hibiscus Tiliaceus L": "rgb(247, 24, 102)",
    "Hydristele Wendlandiana (C. Moore & F. Muell.) H. Wendl. & Drude": "rgb(248, 27, 94)",
    "Jacaranda Acutifolia Humb. & Bonp": "rgb(249, 31, 86)",
    "Joannesia Princeps Vell": "rgb(251, 35, 78)",
    "Khaya Senegalensis (Desr.) A. Juss.": "rgb(252, 39, 71)",
    "Kigelia Africana (Lam.) Benth": "rgb(253, 43, 64)",
    "Lagerstroemia Speciosa (L.) Pers": "rgb(254, 47, 57)",
    "Lepisanthes Tetraphylla (Vahl) Radlk.": "rgb(134, 45, 45)",
    "Leucaena Latisiliqua (L.) Gillis": "rgb(139, 52, 45)",
    "Limonia Acidissima L.": "rgb(143, 60, 45)",
    "Litchi Chinensis Sonn.": "rgb(148, 69, 46)",
    "Livistona Chinensis (Jacq.) R. Br. Ex Mart.": "rgb(153, 78, 46)",
    "Livistona Rotundifolia (Lam.) Mart.": "rgb(158, 88, 46)",
    "Lonchocarpus Minimiflorus J.D. Smith": "rgb(163, 99, 46)",
    "Madhuca Indica J. Gmelin": "rgb(168, 110, 46)",
    "Magnolia Grandiflora L": "rgb(173, 122, 46)",
    "Majidea Zanguebarica Oliv.": "rgb(178, 135, 46)",
    "Malpighia Glabra L.": "rgb(184, 149, 46)",
    "Mangifera Indica L.": "rgb(189, 164, 46)",
    "Manihot Glaziovii Muell. -Arg": "rgb(194, 179, 46)",
    "Manilkara Zapota (L.) P. Royen": "rgb(200, 196, 45)",
    "Markhamia Lutea (Benth.) K.Schum": "rgb(197, 205, 45)",
    "Melaleuca Bracteate F. Muell.": "rgb(190, 210, 45)",
    "Melia Azedarach L": "rgb(180, 213, 48)",
    "Melia Dubia Cav": "rgb(170, 215, 51)",
    "Mesua Ferrea L": "rgb(160, 217, 54)",
    "Michelia Champaca L": "rgb(150, 219, 57)",
    "Michelia Longifolia Blume": "rgb(140, 221, 60)",
    "Millettia Peguensis Ali": "rgb(131, 222, 63)",
    "Millingtonia Hortensis L.F": "rgb(122, 224, 66)",
    "Mimusops Elengi L.": "rgb(113, 226, 70)",
    "Mitragyna Parviflora (Roxb.) Korth.": "rgb(104, 228, 73)",
    "Moringa Oleifera Lam.": "rgb(115, 204, 102)",
    "Morus Alba L.": "rgb(110, 206, 105)",
    "Muntingia Calabura L.": "rgb(108, 208, 110)",
    "Murraya Koenigii (L.) Spreng.": "rgb(111, 211, 121)",
    "Neolomarckia": "rgb(114, 213, 131)",
    "Ochroma Lagopus Sw": "rgb(117, 215, 141)",
    "Others": "rgb(120, 217, 151)",
    "Parkia Biglandulosa Wt. & Arn.": "rgb(123, 219, 161)",
    "Parkinsonia Aculeata L": "rgb(126, 221, 171)",
    "Peltophorum Africanum Sond.": "rgb(129, 223, 181)",
    "Peltophorum Pterocarpum (Dc.) Back. Ex K. Heyne": "rgb(133, 224, 190)",
    "Persea Americana Mille": "rgb(136, 226, 199)",
    "Persea Macrantha (Nees) Kosterm": "rgb(139, 228, 208)",
    "Phoenix Rupicola T. Anders": "rgb(143, 230, 217)",
    "Phoenix Sylvestris (L.) Roxb.": "rgb(146, 231, 225)",
    "Phyllanthus Acidus (L.) Skeels": "rgb(150, 233, 233)",
    "Phyllanthus Polyphykkus Wild": "rgb(153, 228, 234)",
    "Pithecellobium Dulce (Roxb.) Benth.": "rgb(157, 224, 236)",
    "Plumaria alba": "rgb(161, 220, 237)",
    "Plumeri Obtusa L. Var. Obtusa": "rgb(165, 216, 238)",
    "Plumeria Obtusa L. Var. Sericiflora": "rgb(27, 105, 152)",
    "Plumeria Rubra L. Forma Acutifolia": "rgb(27, 98, 157)",
    "Plumeria Rubra L. Forma Lutea": "rgb(26, 91, 162)",
    "Plumeria Rubra L. Forma Rubra": "rgb(26, 83, 168)",
    "Plumeria Rubra L. Forma Tricolor": "rgb(26, 74, 173)",
    "Polyalthia Longifolia (Sonn.) Thwaites": "rgb(51, 77, 153)",
    "Pongamia Pinnata (L.) Pierre": "rgb(51, 70, 158)",
    "Pritchardia Pacifica Seem. & H. Wendl.": "rgb(51, 63, 163)",
    "Prosopis Juliflora (Sw.) Dc.": "rgb(52, 54, 168)",
    "Pseudobombax Ellipticum (H.B.K.) Dug": "rgb(58, 52, 173)",
    "Psidium Guajava L.": "rgb(67, 52, 178)",
    "Pterocarpus Marsupium Roxb": "rgb(78, 52, 183)",
    "Pterospermum Acerifolium (L.) Wild": "rgb(89, 52, 188)",
    "Ptychosperma Macarthuri Nichols": "rgb(101, 51, 193)",
    "Reutealis Trisperma (Blco.) Airy Shaw": "rgb(114, 51, 199)",
    "Rhapis Excelsa Henry": "rgb(128, 51, 204)",
    "Roystonea Regia (H.B.K) O. F. Cook": "rgb(141, 54, 206)",
    "Salix Tetrasperma Roxb": "rgb(155, 57, 208)",
    "Samanea Saman (Jacq.) Merr.": "rgb(169, 60, 211)",
    "Santalum Album L": "rgb(183, 63, 213)",
    "Sapindus Laurifolius Vahl": "rgb(196, 66, 215)",
    "Sapium Sebiferum (L.) Roxb.": "rgb(209, 69, 217)",
    "Saraca Asoca (Roxb.) De Wilde": "rgb(219, 72, 215)",
    "Schleichera Oleosa (Lour.) Oken": "rgb(221, 75, 206)",
    "Schotia Brachypetala Sonder": "rgb(223, 78, 197)",
    "Semecarpus Anacardium L.F": "rgb(224, 82, 189)",
    "Sesbania Grandiflora (L.) Poiret": "rgb(226, 85, 180)",
    "Shorea Roxburghii G. Don": "rgb(228, 88, 172)",
    "Simarouba Glauca Dc.": "rgb(230, 92, 164)",
    "Spathodea Campanulata P. Beauv": "rgb(231, 95, 156)",
    "Spondias Pinnata (L.F.) Kurz": "rgb(210, 121, 155)",
    "Streblus Asper Lour": "rgb(213, 124, 151)",
    "Swietenia Macrophylla King": "rgb(215, 127, 147)",
    "Swietenia Mahagoni (L.) Jacq.": "rgb(217, 130, 143)",
    "Syagrus Romanzoffianum (Cham)": "rgb(219, 133, 140)",
    "Syzygium Aromaticum (L.) Merr. & Perry": "rgb(83, 45, 45)",
    "Syzygium Cumini (L.) Skeels": "rgb(87, 53, 46)",
    "Syzygium Jambos (L.) Alston": "rgb(91, 63, 47)",
    "Syzygium Laetum (Buch. -Ham.)": "rgb(95, 74, 48)",
    "Syzygium Nervosum Dc": "rgb(99, 87, 49)",
    "Syzygium Samarangese (Bl.) Merr. & Perry": "rgb(103, 100, 50)",
    "Tabebuia Aurea (Manso) Benth. & Hook.F. Ex S. Moore": "rgb(100, 108, 51)",
    "Tabebuia Chrysotricha (Mart. Ex Dc.) Standl": "rgb(93, 112, 51)",
    "Tabebuia Impetiginosa (Mart. Ex Dc.) Standl.": "rgb(84, 116, 52)",
    "Tabebuia Pallida (Lindley) Miers": "rgb(74, 121, 53)",
    "Tabebuia Rosea (Bertol) Dc.": "rgb(62, 125, 54)",
    "Tabernaemontana Divericata L. R. Br. Ex Roem. & Schult.": "rgb(54, 129, 59)",
    "Talauma Mutabilis Bl.": "rgb(55, 134, 75)",
    "Tamarindus Indica L.": "rgb(55, 139, 92)",
    "Techoma Stans": "rgb(56, 143, 110)",
    "Tecoma Castanifolia (D. Don) Melch": "rgb(56, 148, 131)",
    "Tectona Grandis L.F": "rgb(56, 153, 153)",
    "Terminalia Arjuna (Roxb. Ex Dc.) Wight & Arn.": "rgb(57, 139, 157)",
    "Terminalia Catappa L": "rgb(57, 123, 162)",
    "Terminalia Crenulata Roth": "rgb(57, 105, 167)",
    "Thespesia Populnea": "rgb(57, 86, 172)",
    "Thespesia Populnea (L.) Sol. Ex Corr. Serr": "rgb(57, 65, 177)",
    "Thevetia Peruviana (Pers.) Merr.": "rgb(73, 58, 182)",
    "Thrinax Parviflora Sw.": "rgb(98, 58, 187)",
    "Tipuana Tipu (Benth.) Kuntze": "rgb(125, 57, 192)",
    "Toona Ciliata M. Roeme": "rgb(154, 57, 198)",
    "Trema Orientalis (L.) Blume": "rgb(183, 60, 200)",
    "Vitex Altissima L.F": "rgb(202, 63, 194)",
    "Vitex Negunda": "rgb(205, 66, 170)",
    "Wrightia Tinctoria (Roxb.) R. Br": "rgb(207, 68, 146)",
    "Ziziphus Mauritiana Lam": "rgb(209, 71, 123)",
    "ficus Drupacea": "rgb(211, 74, 100)"
};

const DEFAULT_COLOR = "rgba(0.86,0.3712,0.34,1)";

const Sidebar = ({ treeData = [], schoolData = 0, elevationData }) => {
    const pieChartHeight = 280;
    const legendHeight = 180;

    return (
        treeData || schoolData || elevationData ? <>
            <div>
                <h2 style={{ marginBottom: '20px' }}>{elevationData?.ward_name} Ward Summary</h2>

                <div style={cardStyle}>
                    <h4 style={{ textAlign: 'center' }}>Distribution of Tree Types</h4>

                    {treeData.length > 0 ? (
                        <div style={{ position: 'relative', height: pieChartHeight + legendHeight }}>
                            <PieChart width={300} height={pieChartHeight}>
                                <Pie
                                    data={treeData}
                                    cx="50%" l
                                    cy="45%"
                                    outerRadius={120}
                                    dataKey="value"
                                    nameKey="name"

                                >
                                    {treeData.map((entry, idx) => {
                                        const col = TREE_COLORS[entry.name] || DEFAULT_COLOR;
                                        return <Cell key={idx} fill={col} />;
                                    })}
                                </Pie>
                                <Tooltip />
                            </PieChart>

                            <div style={legendWrapperStyle}>
                                <div style={legendListStyle}>
                                    {treeData.map((entry, idx) => (
                                        <div key={idx} style={legendItemStyle}>
                                            <span
                                                style={{
                                                    backgroundColor: TREE_COLORS[entry.name] || DEFAULT_COLOR,
                                                    ...legendColorBox,
                                                }}
                                            />
                                            <span style={legendText}>{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center' }}>No tree data available</p>
                    )}
                </div>
                <div style={cardStyle} >
                    <h4 style={{ textAlign: 'center' }}>Number of Schools in the Ward</h4>
                    {schoolData > 0 ? (
                        <p style={{
                            fontSize: '5.8rem',
                            fontWeight: 'bold',
                            color: '#1e88e5',
                            margin: '12px 0 0 0',
                            lineHeight: '1',
                            textAlign: 'center',

                        }}>
                            {schoolData}
                        </p>
                    ) : (
                        <p style={{ textAlign: 'center' }}>No school data available</p>
                    )}
                </div>
                <div style={cardStyle}>
                    <h4 style={{ textAlign: 'center' }}>The average elevation of the ward</h4>
                    {elevationData ? (
                        <p style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#43a047',

                            padding: '6px 12px',
                            borderRadius: '8px',
                            marginTop: '8px',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                        }}>
                            {elevationData?.average_elevation_m} m
                        </p>
                    ) : (
                        <p style={{ textAlign: 'center' }}> No elevation data available</p>
                    )}
                </div>
            </div ></> : null
    );
};

// --- Styles ---

const cardStyle = {
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',

};

const legendWrapperStyle = {
    marginTop: 10,
    maxHeight: 180,
    overflowY: 'auto',
    paddingRight: 5,
};

const legendListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.85rem',
};

const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
};

const legendColorBox = {
    width: '12px',
    height: '12px',
    display: 'inline-block',
    borderRadius: '2px',
    flexShrink: 0,
};

const legendText = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '220px',
};

export default Sidebar;
