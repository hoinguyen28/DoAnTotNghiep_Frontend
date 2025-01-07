import Banner from "./components/Banner/Banner";
import HeroSection from"../products/components/HeroSection/HeroSection";
import Carousel from "./components/Carousel/Carousel";
import ArtList from "../products/ArtList";
import NewArtList from "../products/NewArtList";
import ArtRecommendations from "../products/components/ArtRecommendations";
import useScrollToTop from "../../hooks/ScrollToTop";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	return (
		<>
			<div className='d-md-none d-sm-none d-lg-block'>
			<HeroSection
        title="Up to 25% Off Sitewide*"
        description="Sự kiện giảm giá vui vẻ. Những tác phẩm do nghệ sĩ thiết kế cho mọi không gian."
        buttonText="Mua sắm ngay"
        buttonUrl="/search"
        imgUrl="https://society6.com/cdn/shop/files/framed_posters_sbr_c.jpg"
      />
				{/* Slide img */}
				<div className='d-flex justify-content-center align-items-center pb-4'>
					<hr className='w-100 mx-5' />
				</div>
				<Banner />
				{/* Underline */}
				<div className='d-flex justify-content-center align-items-center pb-4'>
					<hr className='w-100 mx-5' />
				</div>
			<NewArtList />
			<Carousel />
			{/* New Product */}
			<div className='container'>
			</div>
			{/* Banner */}
			</div>
			{/* Product List */}
			<ArtList size={8} />
			<ArtRecommendations />
		</>
	);
};

export default HomePage;
