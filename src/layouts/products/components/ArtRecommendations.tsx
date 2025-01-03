import React, { useEffect, useState } from "react";
import ArtProps from "./ArtProps/ArtProps"; // Import component ArtProps
import { endpointBE } from "../../utils/Constant";
import { getIdUserByToken, isToken } from "../../utils/JwtService"; // Giả sử bạn có hàm này
import { toast } from "react-toastify";

// Định nghĩa kiểu cho Art
interface Art {
  idArt: number;
  nameArt: string;
  finalPrice: number; 
  quantity: number;
  thumbnail: string;
  price: number;
}

const ArtRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Art[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy userId từ token nếu người dùng đã đăng nhập
  const userId = getIdUserByToken(); // Hàm lấy userId từ token

  useEffect(() => {
    if (!isToken()) {
      setError("Bạn phải đăng nhập để xem các gợi ý.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }

    // Gọi API để lấy gợi ý tranh
    fetch(`${endpointBE}/recommendations/top-similar/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu gợi ý tranh.");
        }
        return response.json();
      })
      .then((data) => {
        // Kiểm tra và sử dụng dữ liệu trả về từ server
        setRecommendations(data); // Dữ liệu đã có price và finalPrice, không cần thêm
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Gợi ý tranh cho bạn</h2>
      <div className="row">
        {recommendations.length > 0 ? (
          recommendations.map((art) => (
            <ArtProps key={art.idArt} art={art} />
          ))
        ) : (
          <p>Không có tranh gợi ý.</p>
        )}
      </div>
    </div>
  );
};

export default ArtRecommendations;
