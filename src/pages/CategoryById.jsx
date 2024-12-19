import { useNavigate, useParams } from "react-router-dom";
import menuJson from '../data/main.json';
import examplePhoto from '../assets/images/image-category.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useState } from "react";
import translateWords from "../utils/translateWords";

export const CategoryById = () => {
    const navigate = useNavigate();
    const [newDataSushi, setNewDataSushi] = useState([]);
    const [ datawrite, setDataWrite ] = useState('');
    const { category, dishes } = useParams(); 

    const toBack = () => {
        navigate('/');
    }

    const roundPrice = (price) => {
        // Extraemos el precio base multiplicado
        const basePrice = price * 1.60;
        const cents = basePrice % 1;

        // const basePrice = price;
        // const cents = basePrice;
    
        // Redondear según el rango de centavos
        if (cents <= 0.50) {
            return Math.floor(basePrice) + 0.50; // Redondea a .50
        } else {
            return Math.floor(basePrice) + 0.99; // Redondea a .99
        }
    };

    // Filtrar los datos según las condiciones
    let filterData = menuJson;

    // Filtrar por `dishes` y `category`
    if (dishes !== undefined) {
        filterData = menuJson.filter(main => 
            translateWords.statusCategory[main.categoria] === dishes &&
            translateWords.statusSubCategory[main.subcategoria] === category &&
            main.nombre.toLowerCase().includes(datawrite.toLowerCase()) // Comparación insensible a mayúsculas
        );
    } else {
        // Si `dishes` es undefined, solo filtra por subcategoría y búsqueda
        filterData = menuJson.filter(main =>
            translateWords.statusSubCategory[main.subcategoria] === category &&
            main.nombre.toLowerCase().includes(datawrite.toLowerCase())
        );
    }

    // Ordenar los datos filtrados
    const orderedData = [...filterData].sort((a, b) => a.nombre.localeCompare(b.nombre));

    const baseDelay = 3000;

    const convertSushi = () => {
        setNewDataSushi(orderedData.filter(data => data.isRoll));
    };

    const convertAll = () => {
        setNewDataSushi([]);
    };

    const renderCardBody = (data) => (
        <div className="card-body" key={data.id}>
            <div className="card-image">
                <Swiper
                    autoplay={{
                        delay: baseDelay,
                        disableOnInteraction: false,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="mySwiper"
                >
                    {data.images.length > 0 ? (
                        data.images.map((pic) => (
                            <SwiperSlide key={pic}>
                                <img src={pic} alt={data.nombre} width={30} height={30} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <img src={examplePhoto} alt="default" width={30} height={30} />
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
            <div className="card-body_container">
                <div className="card-header"> 
                    <h2>{data.nombre}</h2>
                        <div>
                            <span className="big-price">${roundPrice(data.precio).toFixed(2)}</span><br />
                        </div>
                    </div>
                <p className="card-description">{data.descripcion}</p>
            </div>
        </div>
    );

    return (
        <section className="main-category">
            <div className="main-back_page-container">
                <div className="main-back_page" onClick={toBack}>
                    <i className="fa-solid fa-arrow-left"></i> <span>Regresar</span>
                </div>
                <div className="search-product2">
                    {
                        datawrite.length >= 1 ? (
                            <>
                                <i class="fa-solid fa-x" onClick={() => setDataWrite('')}></i>
                            </>
                        ) : (
                            <>
                                <i class="fa-solid fa-magnifying-glass" for="search-product" onClick={() => document.getElementById("search-product").focus()}></i>
                            </>
                        )
                    }
                    <input type="text" className="search-product" placeholder="Buscar..." name="search-product" id="search-product" value={datawrite} onChange={(e) => setDataWrite(e.target.value)}/>
                </div>
                {window.location.hash === '#/main/dishes/japanese' && (
                    <div className="sushi-category">
                        <span onClick={newDataSushi.length > 0 ? convertAll : convertSushi}>
                            {newDataSushi.length > 0 ? 'Ver todo' : 'Sushi'}
                        </span>
                    </div>
                )}
            </div>
            <div className="card">
                {category === 'all' ? (
                    menuJson
                        .filter((data) =>
                            data.nombre.toLowerCase().includes(datawrite.toLowerCase()) // Filtra por el texto de búsqueda
                        )
                        .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordena alfabéticamente
                        .map((data) => renderCardBody(data)) // Renderiza las tarjetas
                ) : (
                    (newDataSushi.length > 0 ? newDataSushi : orderedData).map((data) => renderCardBody(data))
                )}
            </div>
        </section>
    );
};
