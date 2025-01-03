import React from "react";
import "./Carousel.css";


function Carousel() {
	return (
		<div
			id='carouselExampleIndicators'
			className='carousel slide mb-5'
			data-mdb-ride='carousel'
		>
			<div className='carousel-indicators'>
				<button
					type='button'
					data-mdb-target='#carouselExampleIndicators'
					data-mdb-slide-to='0'
					className='active'
					aria-current='true'
					aria-label='Slide 1'
				></button>
				<button
					type='button'
					data-mdb-target='#carouselExampleIndicators'
					data-mdb-slide-to='1'
					aria-label='Slide 2'
				></button>
				<button
					type='button'
					data-mdb-target='#carouselExampleIndicators'
					data-mdb-slide-to='2'
					aria-label='Slide 3'
				></button>
			</div>
			<div className='carousel-inner'>
				<div className='carousel-item active'>
					<img
						src={"https://society6.com/cdn/shop/files/WallArt_Hero_3.jpg?v=1727132245&width=1980&height=1320&crop=center"}
						className='d-block w-100'
						alt='Wild Landscape'
					/>
				</div>
				<div className='carousel-item'>
					<img
						src={"https://society6.com/cdn/shop/files/40b6dc3964d44638a2f5416f6fe91e1b.jpg?v=1725066229&width=1980&height=1980&crop=center"}
						className='d-block w-100'
						alt='Camera'
					/>
				</div>
				<div className='carousel-item'>
					<img
						src={"https://society6.com/cdn/shop/files/47058a50b4e0413ca025ef1b00c7acf8_8cf9cbab-de0f-4dab-b4d1-a191721a8f3e.jpg?v=1726897599&width=1980&height=1980&crop=center"}
						className='d-block w-100'
						alt='Exotic Fruits'
					/>
				</div>
			</div>
			<button
				className='carousel-control-prev'
				type='button'
				data-mdb-target='#carouselExampleIndicators'
				data-mdb-slide='prev'
			>
				<span
					className='carousel-control-prev-icon'
					aria-hidden='true'
				></span>
				<span className='visually-hidden'>Previous</span>
			</button>
			<button
				className='carousel-control-next'
				type='button'
				data-mdb-target='#carouselExampleIndicators'
				data-mdb-slide='next'
			>
				<span
					className='carousel-control-next-icon'
					aria-hidden='true'
				></span>
				<span className='visually-hidden'>Next</span>
			</button>
		</div>
	);
}

export default Carousel;