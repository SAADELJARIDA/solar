import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowRight, FaSolarPanel, FaChartLine, FaTools, FaRecycle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const Info = () => {
  const location = useLocation();
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [showMaintenanceDetails, setShowMaintenanceDetails] = useState(false);
  const [showRecyclingDetails, setShowRecyclingDetails] = useState(false);
  const [showPredictionDetails, setShowPredictionDetails] = useState(false);
  
  // Scroll to the section ID from hash when component mounts or location changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  const toggleTechDetails = () => {
    setShowTechDetails(!showTechDetails);
  };
  
  const toggleMaintenanceDetails = () => {
    setShowMaintenanceDetails(!showMaintenanceDetails);
  };
  
  const toggleRecyclingDetails = () => {
    setShowRecyclingDetails(!showRecyclingDetails);
  };
  
  const togglePredictionDetails = () => {
    setShowPredictionDetails(!showPredictionDetails);
  };
  
  // Mock data for info sections
  const infoSections = [
    {
      id: 'tech',
      title: 'Technologies photovoltaïques',
      description: `Les cellules photovoltaïques convertissent la lumière du soleil directement en électricité. 
        Elles sont généralement fabriquées à partir de silicium cristallin, mais il existe aussi des technologies 
        à couches minces et des cellules de nouvelle génération. L'efficacité des cellules varie selon leur 
        composition, leur fabrication et leur âge.`,
      image: '/images/technology.jpg',
      alt: 'Technologies photovoltaïques'
    },
    {
      id: 'prediction',
      title: 'Prévision dans la transition énergétique',
      description: `La prévision joue un rôle crucial dans la transition énergétique en permettant d'optimiser 
        la production solaire. Grâce à l'analyse des données environnementales et aux modèles prédictifs avancés, 
        il est possible d'anticiper avec précision le rendement des installations photovoltaïques et ainsi 
        maximiser leur efficacité tout en réduisant les coûts opérationnels.`,
      image: '/images/prediction.jpg',
      alt: 'Prévision dans la transition énergétique'
    },
    {
      id: 'maintenance',
      title: 'Méthodes de maintenance préventive',
      description: `Une maintenance régulière est cruciale pour maximiser la durée de vie et l'efficacité des 
        installations photovoltaïques. Cela inclut le nettoyage des panneaux, l'inspection des connexions électriques, 
        et la surveillance des performances. Des systèmes de détection avancés permettent d'identifier rapidement 
        les problèmes potentiels avant qu'ils ne deviennent critiques.`,
      image: '/images/maintenance.jpg',
      alt: 'Méthodes de maintenance préventive'
    },
    {
      id: 'recycling',
      title: 'Recyclage',
      description: `Les panneaux solaires modernes sont conçus pour être recyclés en fin de vie, réduisant ainsi leur impact environnemental global. Découvrez comment les différents composants sont traités et réutilisés dans de nouveaux produits.`,
      image: '/images/recycling.jpg',
      alt: 'Recyclage des panneaux solaires'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Centre d'information</h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">
        Découvrez les informations essentielles sur les technologies photovoltaïques, 
        la prévision énergétique, la maintenance et le recyclage des installations solaires.
      </p>
      
      {/* Navigation par onglets */}
      <div className="mb-10 border-b border-gray-200">
        <nav className="flex flex-wrap space-x-1 md:space-x-4 overflow-x-auto pb-1" aria-label="Sections">
          <a href="#tech" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-t-lg hover:bg-gray-100 group">
            <FaSolarPanel className="mr-2 text-green-600" />
            Technologies photovoltaïques
          </a>
          <a href="#prediction" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-t-lg hover:bg-gray-100 group">
            <FaChartLine className="mr-2 text-green-600" />
            Prévision dans la transition énergétique
          </a>
          <a href="#maintenance" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-t-lg hover:bg-gray-100 group">
            <FaTools className="mr-2 text-green-600" />
            Méthodes de maintenance préventive
          </a>
          <a href="#recycling" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-t-lg hover:bg-gray-100 group">
            <FaRecycle className="mr-2 text-green-600" />
            Impact environnemental et recyclage
          </a>
        </nav>
      </div>
      
      {/* Info sections */}
      <div className="space-y-24">
        {infoSections.map((section, index) => (
          <section 
            key={section.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden pt-4 pb-6" 
            id={section.id}
          >
            <div className="bg-green-50 py-3 px-6 mb-6 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-800">
                {section.id === 'tech' && <FaSolarPanel className="inline-block mr-3 text-green-600" />}
                {section.id === 'prediction' && <FaChartLine className="inline-block mr-3 text-green-600" />}
                {section.id === 'maintenance' && <FaTools className="inline-block mr-3 text-green-600" />}
                {section.id === 'recycling' && <FaRecycle className="inline-block mr-3 text-green-600" />}
                {section.title}
              </h2>
            </div>
            
            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="w-full md:w-1/2 p-8">
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{section.description}</p>
                </div>
                
                {section.id === 'tech' && (
                  <button 
                    onClick={toggleTechDetails} 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Learn more {showTechDetails ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
                  </button>
                )}
                
                {section.id === 'prediction' && (
                  <button 
                    onClick={togglePredictionDetails} 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Learn more {showPredictionDetails ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
                  </button>
                )}
                
                {section.id === 'maintenance' && (
                  <button 
                    onClick={toggleMaintenanceDetails} 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Learn more {showMaintenanceDetails ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
                  </button>
                )}
                
                {section.id === 'recycling' && (
                  <button 
                    onClick={toggleRecyclingDetails} 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Learn more {showRecyclingDetails ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
                  </button>
                )}
              </div>
              <div className="w-full md:w-1/2 p-4">
                <img 
                  src={section.image} 
                  alt={section.alt} 
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  style={{ minHeight: '300px', maxHeight: '400px' }}
                />
              </div>
            </div>
            
            {/* Contenu détaillé sous l'image pour la section tech */}
            {section.id === 'tech' && showTechDetails && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner mx-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What does photovoltaic mean?</h3>
                <p className="mb-4 text-gray-700">Photovoltaic, derived from the Greek words for light and energy, phos and volt, refers to the conversion of light directly into electricity. Literally translated, it means "light energy."</p>
                <p className="mb-4 text-gray-700">This conversion is achieved through the use of semiconductor materials, such as silicon and cadmium telluride.</p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">The history of photovoltaics</h3>
                <p className="mb-3 text-gray-700">Solar technology has a long history, longer than you might think. In fact, the first recorded mention of solar technology was back in 1767 when Swiss scientist Horace-Benedict de Saussure designed what he called a "solar collector cell."</p>
                <p className="mb-3 text-gray-700">These solar collector cells were essentially glorified magnifying glasses, with multiple layers of glass focusing the sun into an insulated box to capture the heat generated. After this, the next and perhaps most significant leap came in 1839.</p>
                <p className="mb-3 text-gray-700">Young French scientist Edmond Becquerel first observed the photovoltaic effect when experimenting with conductance and illumination. The photovoltaic effect is the process by which sunlight is converted into electricity, although it would be a number of years from this first observation until the process was understood and described for the first time.</p>
                <p className="mb-3 text-gray-700">A number of scientists made contributions to the field during the rest of the 1800s, with the photovoltaic effect being observed in selenium which later led to the construction of the first selenium solar cell in 1877. At this time, scientists knew that the photovoltaic effect worked but no one knew how.</p>
                <p className="mb-3 text-gray-700">The theory behind the photovoltaic effect was first described by a familiar name, Albert Einstein. In his 1905 paper, Einstein described what he termed the "photoelectric effect," laying out the photovoltaic effect in detail for the first time. This discovery would go on to net him the Nobel Prize in physics in 1922.</p>
                <p className="mb-3 text-gray-700">The first practical solar cell was developed in 1954 by scientists at the Bell Laboratory. With this first boundary crossed, the US government began pouring substantial funding into solar PV research with the hopes of creating viable solar panels to be used on orbiting satellites.</p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">What is a photovoltaic cell?</h3>
                <p className="mb-3 text-gray-700">A photovoltaic (PV) cell is the physical piece of equipment that converts light into electricity. PV cells usually consist of a number of different layers, each serving a specific purpose. These layers will differ depending on the type of cell but typically include:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Semiconductor layer — This is the layer that actually converts the light into electrical energy. Made up of two distinct layers: p-type & n-type</li>
                  <li className="mb-2">Conducting layers — Sit on either side of the semiconductor layer, the conducting material collects the energy produced</li>
                  <li className="mb-2">Anti-reflection coating — This layer is applied to the side of the cell that is facing the sun and is used to reduce the amount of light that is reflected off of the PV cell</li>
                  <li className="mb-2">Frames and Glass — The PV cell is encased in a frame, usually made of aluminum, and is covered by a protective layer of glass to avoid damage to the cell</li>
                </ul>
              </div>
            )}
            
            {/* Contenu détaillé sous l'image pour la section maintenance */}
            {section.id === 'maintenance' && showMaintenanceDetails && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner mx-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Solar Panel Maintenance Checklist</h3>
                <p className="mb-4 text-gray-700">Here's a handy checklist you can follow to ensure your solar panels stay in peak condition:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Regular Visual Inspections: Check for dirt, debris, or shading issues that could affect performance.</li>
                  <li className="mb-2">Cleaning: Safely remove dust, bird droppings, and other buildup that can reduce efficiency.</li>
                  <li className="mb-2">Inspect Electrical Connections: Ensure all wiring and connections are secure and free from wear or corrosion.</li>
                  <li className="mb-2">Monitor Energy Output: Regularly track your system's performance to catch any drops in energy production.</li>
                  <li className="mb-2">Check for Damage: Look for cracks, scratches, or any signs of damage on the panels.</li>
                  <li className="mb-2">Inspect the Inverter: Ensure the inverter is functioning properly and free from faults.</li>
                  <li className="mb-2">Verify Panel Alignment: Make sure panels are correctly aligned and angled for maximum sunlight exposure.</li>
                  <li className="mb-2">Maintain the Mounting System: Tighten any loose bolts and check for corrosion or wear on the mounting hardware.</li>
                  <li className="mb-2">Review Manufacturer Guidelines: Follow the manufacturer's maintenance recommendations to keep your warranty intact.</li>
                </ul>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">How to Maintain Solar Panels</h3>
                <p className="mb-3 text-gray-700">Proper maintenance of your solar panels is essential for ensuring they continue to operate efficiently and have a long lifespan. Below are key steps to help you maintain your solar panels effectively:</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">1. Regular Visual Inspections</h4>
                <p className="mb-3 text-gray-700">Begin by inspecting your solar panels regularly, ideally every few months. During these inspections, look for:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Visible Dirt and Debris: Check for any dirt, dust, or debris that may have accumulated on the surface of the panels, as these can reduce efficiency.</li>
                  <li className="mb-2">Visible Damage: Look for any cracks, chips, or other damage on the panels. If you notice any issues, it's important to contact a solar panel technician for repair or replacement as soon as possible.</li>
                  <li className="mb-2">Wiring and Connections: Ensure that all wiring and connections are secure and free from corrosion. Loose or damaged wires can negatively affect your system's performance, so address any issues promptly.</li>
                  <li className="mb-2">Inspect the Mounting System: Ensure that the mounting hardware is secure and free from corrosion. Loose mounts can cause panels to shift or become misaligned, reducing efficiency.</li>
                  <li className="mb-2">Check for Shading Changes: Look for any new sources of shading, such as growing trees or newly built structures that might block sunlight from reaching the panels.</li>
                </ul>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">2. Cleaning Solar Panels</h4>
                <p className="mb-3 text-gray-700">Keeping your solar panels clean is essential for maintaining their efficiency. Over time, dust, bird droppings, and other debris can accumulate on the surface, blocking sunlight and reducing energy production. Here's how to clean them properly:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Choose the Right Time: Clean your panels on a cool, cloudy day or early in the morning to avoid water evaporating quickly and leaving streaks.</li>
                  <li className="mb-2">Use the Right Tools: A soft brush, sponge, or microfiber cloth combined with water is typically sufficient. For safety, clean your panels from the ground using an extension pole. Avoid using harsh chemicals or abrasive materials that could scratch the panels.</li>
                  <li className="mb-2">Be Gentle: Apply gentle pressure while cleaning to avoid damaging the solar cells or protective glass.</li>
                  <li className="mb-2">Rinse Thoroughly: After cleaning, rinse the panels with clean water to remove any soap residue or remaining dirt.</li>
                  <li className="mb-2">Avoid Risky Conditions: If you can't safely reach your solar panels, consider hiring a professional cleaner to do this.</li>
                </ul>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">3. Checking Electrical Connections</h4>
                <p className="mb-3 text-gray-700">Ensuring that your solar panel system's electrical connections are secure and in good condition is crucial for maintaining system performance and safety. Here's how to check them:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Visual Inspection: Look for any visible signs of wear, corrosion, or damage on the wiring and connectors.</li>
                  <li className="mb-2">Tighten Loose Connections: Gently tighten any loose wires or connectors, but be careful not to over-tighten, as this can cause damage.</li>
                  <li className="mb-2">Inspect Junction Boxes: Open the junction boxes to check for moisture, which can cause corrosion, and ensure all connections inside are secure.</li>
                  <li className="mb-2">Check for Proper Insulation: Ensure that all wiring is properly insulated to prevent short circuits or other electrical issues.</li>
                  <li className="mb-2">Monitor for Fault Codes: If your inverter panel displays any fault codes, this could indicate an issue with the electrical connections that needs to be addressed immediately.</li>
                </ul>
                <p className="mb-3 text-gray-700">If you notice any issues during your inspection, it's advisable to contact a professional solar installer or electrician to resolve the problems safely.</p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">Why is Solar Panel Maintenance Important?</h3>
                <p className="mb-3 text-gray-700">Regular solar panel maintenance is crucial for ensuring that your solar panels operate at their highest efficiency and for extending the lifespan of your system. Neglecting maintenance can lead to decreased energy production, costly repairs, and a shorter system lifespan.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Longevity and Efficiency</h4>
                <p className="mb-3 text-gray-700">Your solar panels are a significant investment in clean energy, with the potential to last 25 years or more. Proper maintenance is essential to achieving this lifespan. Over time, dust, dirt, debris, and exposure to the elements can accumulate on your panels, reducing their ability to absorb sunlight. This decrease in sunlight absorption leads to lower energy output, which directly impacts the efficiency of your solar energy system.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Financial Consequences of Neglect</h4>
                <p className="mb-3 text-gray-700">Neglecting solar panel maintenance doesn't just reduce their lifespan; it also affects your finances. Dirty or poorly maintained panels can lose 15% to 35% of their efficiency, depending on environmental factors. This loss in efficiency translates to a significant reduction in energy production, meaning you won't fully benefit from your solar power system.</p>
              </div>
            )}
            
            {/* Contenu détaillé sous l'image pour la section recyclage */}
            {section.id === 'recycling' && showRecyclingDetails && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner mx-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Recyclage</h3>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Les panneaux solaires recyclables à plus de 94%</h4>
                <p className="mb-4 text-gray-700">Les panneaux solaires sont recyclables à 94,7%. Une fois qu'ils sont recyclés, ils servent à fabriquer de nouveaux panneaux ou entrent dans la composition d'autres types de produits.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Quels sont les éléments recyclables dans un panneau solaire ?</h4>
                <p className="mb-3 text-gray-700">Grâce à un taux élevé de revalorisation, la grande majorité des composants d'un panneau solaire est réutilisable.</p>
                <p className="mb-3 text-gray-700">C'est le cas pour :</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Le verre,</li>
                  <li className="mb-2">Le plastique ou matériau composite,</li>
                  <li className="mb-2">Le cuivre,</li>
                  <li className="mb-2">Le cuivre étamé,</li>
                  <li className="mb-2">L'argent,</li>
                  <li className="mb-2">Le silicium,</li>
                  <li className="mb-2">L'aluminium.</li>
                </ul>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Qu'est-ce qui ne se recycle pas dans un panneau solaire ?</h4>
                <p className="mb-4 text-gray-700">Ainsi, environ 5% seulement des éléments d'un panneau solaire ne sont pas recyclables. Il s'agit essentiellement des éléments de connectique, qui servent à relier les modules photovoltaïques entre eux et à l'onduleur solaire.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Comment les éléments recyclés sont réutilisés ?</h4>
                <p className="mb-3 text-gray-700">Les différents composants d'un panneau solaire photovoltaïque sont recyclés, puis réutilisés de différentes façons.</p>
                <p className="mb-3 text-gray-700">Voici les processus à savoir.</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li className="mb-3">
                    <span className="font-semibold">Le verre</span><br/>
                    C'est un matériau recyclable à l'infini, car il peut être réutilisé pour fabriquer des bouteilles, des vitrages de panneaux solaires, ou encore de la fibre de verre.
                  </li>
                  <li className="mb-3">
                    <span className="font-semibold">Le plastique</span><br/>
                    Il est broyé et utilisé comme combustible solide de récupération (CSR) pour assurer l'alimentation en énergie des cimenteries. Le film en plastique transparent peut également être transformé en granulés, puis fondu avant d'être utilisé comme matière première.
                  </li>
                  <li className="mb-3">
                    <span className="font-semibold">Le cuivre, l'argent et le cuivre étamé</span><br/>
                    Ces métaux sont séparés chimiquement avant d'être fondus et réutilisés comme conducteurs ou connecteurs, par exemple.
                  </li>
                  <li className="mb-3">
                    <span className="font-semibold">Le silicium</span><br/>
                    Elément constitutif des cellules photovoltaïques, le silicium est recyclable jusqu'à 4 fois. Il est fondu, puis réutilisé pour la fabrication de nouvelles cellules photovoltaïques.
                  </li>
                  <li className="mb-3">
                    <span className="font-semibold">L'aluminium</span><br/>
                    Ce métal est également recyclable à l'infini. Il peut être réutilisé pour la fabrication de nouveaux panneaux solaires, ou servir à bien d'autres utilisations différentes.
                  </li>
                </ul>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">Prolongez la durée de vie de vos panneaux photovoltaïques !</h3>
                <p className="mb-3 text-gray-700">La durée de vie d'un panneau solaire est estimée entre 25 et 40 ans selon leur technologie. Les panneaux monocristallins sont les plus durables avec une longévité d'environ 40 ans, contre 25 ans pour les modules polycristallins. L'onduleur solaire, un élément essentiel de l'installation photovoltaïque et dure, quant à lui, environ 10 ans.</p>
                <p className="mb-3 text-gray-700">Pour une longévité accrue, il faut entretenir régulièrement les panneaux photovoltaïques. Il convient aussi d'installer l'onduleur solaire dans un endroit aéré pour assurer la ventilation de ses composants.</p>
                <p className="mb-5 text-gray-700 font-semibold">Bon à savoir : Cap Soleil Energie vous offre une visite annuelle d'entretien pendant les 2 années qui suivent la date de l'installation.</p>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6">Comment se déroule le recyclage d'un panneau solaire ?</h3>
                <p className="mb-3 text-gray-700">Le recyclage d'un panneau solaire photovoltaïque peut se faire de deux manières : soit par broyage, soit par délamination.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Le recyclage par broyage</h4>
                <p className="mb-3 text-gray-700">Cette technique est particulièrement adaptée au recyclage des panneaux très usagés qui comportent des éléments cassés. Le recyclage par broyage facilite la séparation des différents éléments.</p>
                <p className="mb-3 text-gray-700">Voici les différentes étapes :</p>
                <ol className="list-decimal pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Lors du pré-démantèlement, le cadre en aluminium, les boîtiers de jonction, les connectiques et les câbles sont retirés,</li>
                  <li className="mb-2">Le cadre en aluminium est acheminé vers une fonderie pour être recyclé,</li>
                  <li className="mb-2">Les boîtiers de jonction sont envoyés vers une autre chaîne de recyclage et servent à fabriquer des petits appareils ménagers,</li>
                  <li className="mb-2">Une fois que les plaques laminées sont entièrement isolées, elles passent à l'étape du broyage ou criblage afin d'obtenir des fragments de particules de tailles différentes,</li>
                  <li className="mb-2">Chaque fragment est ensuite isolé tout au long du tri progressif qui emploie plusieurs techniques,</li>
                  <li className="mb-2">Les déchets sont triés en fonction de leur masse et de leur densité,</li>
                  <li className="mb-2">Les différents éléments, comme le plastique, l'argent, le cuivre et le cuivre étamé sont isolés,</li>
                  <li className="mb-2">Les éléments métalliques non-ferromagnétiques sont également isolés afin de récupérer le verre, le cuivre et les résidus d'aluminium,</li>
                  <li className="mb-2">Ces matériaux ainsi recyclés et triés passent à un nouveau cycle de vie comme matières premières secondaires.</li>
                </ol>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Le recyclage par délamination</h4>
                <p className="mb-3 text-gray-700">Cette technique à très haute valeur ajoutée permet de recycler le plus grand nombre possible de composants sur un panneau solaire usé. Elle est aussi appelée technique de délamination par lame chaude.</p>
                <p className="mb-3 text-gray-700">Voici le processus correspondant :</p>
                <ol className="list-decimal pl-6 mb-4 text-gray-700">
                  <li className="mb-2">Une lame chauffée à 300°C sépare les cellules photovoltaïques de la plaque de verre dans la longueur,</li>
                  <li className="mb-2">Restée intacte, la plaque de verre est récupérée et réutilisée pour fabriquer des fenêtres, des vérandas, etc.</li>
                  <li className="mb-2">Les cellules photovoltaïques passent par des traitements thermiques et chimiques afin d'isoler les différents métaux,</li>
                  <li className="mb-2">Les fragments de métaux (cuivre, argent, etc.) sont réutilisés comme matières premières secondaires.</li>
                </ol>
              </div>
            )}
            
            {/* Contenu détaillé sous l'image pour la section prédiction */}
            {section.id === 'prediction' && showPredictionDetails && (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner mx-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Le rôle stratégique de la prévision dans la transition énergétique</h3>
                <p className="mb-4 text-gray-700">La transition énergétique, indispensable pour répondre aux enjeux climatiques et assurer un avenir durable, repose sur l'adoption massive de sources d'énergie renouvelable telles que le solaire, l'éolien ou l'hydraulique. Toutefois, l'un des plus grands défis associés à ces sources est leur variabilité. Contrairement aux énergies fossiles, leur production dépend fortement de conditions naturelles fluctuantes. C'est dans ce contexte que la prévision joue un rôle central et stratégique.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Optimiser la production d'énergie renouvelable</h4>
                <p className="mb-4 text-gray-700">Les modèles de prévision permettent d'anticiper avec précision la production d'énergie à partir de données environnementales telles que l'irradiance solaire, la température, la vitesse du vent ou l'humidité. En particulier pour le photovoltaïque, la prédiction de l'ensoleillement et de la température ambiante est cruciale pour estimer la performance des panneaux. Une bonne prévision permet ainsi d'ajuster la production, éviter les pertes d'énergie, et assurer une alimentation électrique stable, même avec des sources intermittentes.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Réduire les coûts et améliorer la planification</h4>
                <p className="mb-4 text-gray-700">Les prévisions permettent également d'optimiser l'exploitation des installations et de mieux planifier les opérations de maintenance préventive. Cela prolonge la durée de vie des équipements et réduit les interruptions coûteuses. De plus, en anticipant les pics et les creux de production, les opérateurs peuvent mieux gérer le stockage d'énergie ou l'utilisation de sources de secours, ce qui diminue les coûts opérationnels et améliore la rentabilité.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-4">Intégration intelligente au réseau électrique</h4>
                <p className="mb-4 text-gray-700">La prévision est également essentielle pour l'équilibrage du réseau électrique. Les gestionnaires de réseau doivent maintenir en permanence un équilibre entre l'offre et la demande. Une production imprévisible peut provoquer des déséquilibres critiques. Grâce aux systèmes prédictifs, il est possible de mieux intégrer les énergies renouvelables au réseau, d'activer les batteries de stockage ou de délester certains usages selon les prévisions, garantissant ainsi la stabilité du système.</p>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">Un levier clé pour une transition réussie</h4>
                <p className="mb-4 text-gray-700">En somme, la prévision énergétique est un levier clé pour relever les défis de la transition énergétique. Elle permet non seulement d'exploiter de manière plus efficace et fiable les sources renouvelables, mais aussi de soutenir l'évolution vers un système énergétique plus intelligent, flexible et durable. Sans des outils de prévision robustes, l'intégration massive des énergies renouvelables resterait limitée par leur intermittence.</p>
              </div>
            )}
            
            <div className="px-8 pt-4 flex justify-end">
              <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                Retour en haut ↑
              </a>
            </div>
          </section>
        ))}
      </div>

      {/* Additional resources section */}
      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ressources additionnelles</h2>
        <p className="text-gray-600 mb-6">
          Pour approfondir vos connaissances sur l'énergie solaire et ses applications, 
          consultez ces ressources sélectionnées par nos experts :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><a href="https://www.irena.org/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Agence internationale pour les énergies renouvelables (IRENA)</a></li>
          <li><a href="https://www.ises.org/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Société internationale de l'énergie solaire (ISES)</a></li>
          <li><a href="https://www.nrel.gov/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Laboratoire national des énergies renouvelables (NREL)</a></li>
          <li><a href="http://www.greenenergypark.ma/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Green Energy Park</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Info;
