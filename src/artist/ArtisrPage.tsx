import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArtistDetails from "./components/artist/ArtistProps";
import { getAllArtArtist1 } from "../api/ArtApi"; // Thêm API lấy artList
import ArtProps from "../layouts/products/components/ArtProps/ArtProps"; // Import component hiển thị art
import ArtModel from "../model/ArtModel"

const ArtistPage: React.FC = () => {
  const { idArtist } = useParams<{ idArtist: string }>(); // Lấy tham số idArtist từ URL
  const [artistId, setArtistId] = useState<number | null>(null);
  const [artList, setArtList] = useState<ArtModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erroring, setErroring] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra nếu idArtist có giá trị và chuyển nó thành số
    if (idArtist) {
      setArtistId(parseInt(idArtist));
    } else {
      setArtistId(null);
    }
  }, [idArtist]); // Khi idArtist thay đổi, cập nhật state artistId

  useEffect(() => {
    if (artistId !== null) {
      // Gọi API để lấy danh sách tác phẩm nghệ thuật của nghệ sĩ
      getAllArtArtist1(artistId)
        .then((response) => {
          setArtList(response.artList); 
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setErroring(error.message);
        });
    }
  }, [artistId]); // Chạy khi artistId thay đổi

  return (
    <div className="artist-page">
      <h1></h1>
      
      {/* Hiển thị chi tiết nghệ sĩ */}
      {artistId !== null ? (
        <ArtistDetails idUser={artistId} />
      ) : (
        <p>Invalid artist ID.</p>
      )}

      {/* Hiển thị thông báo khi có lỗi */}
      {erroring && <p>Error: {erroring}</p>}

      {/* Hiển thị thông tin danh sách tác phẩm nghệ thuật */}
      {loading ? (
        <p>Loading artworks...</p>
      ) : (
        <div className='container-art container mb-5 pb-5 px-5 '>
            <h2
  style={{
    textAlign: "center",
    color: "#000",
    fontFamily: "Essonnes-Headline, serif !important",
    fontWeight: '400 !important',
    margin: "0",
    fontSize: "clamp(3.75rem, 1.55rem + 9.39vw, 8rem)",
    marginTop: "1rem",
    padding: "1rem 0",
    marginBottom: "0",
  }}
>
   Kho tranh
</h2>

			<hr className='mt-0' />
        <div className="row">
          {artList.map((art) => (
            <ArtProps key={art.idArt} art={art} />
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
