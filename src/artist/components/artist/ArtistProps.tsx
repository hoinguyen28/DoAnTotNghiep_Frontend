import React, { useEffect, useState } from "react";
import { getArtistbyId } from "../../../api/UserApi"; 
import UserModel from "../../../model/UserModel"; 
import { Link } from "react-router-dom";
import "./ArtistProps.css";

interface ArtistDetailsProps {
  idUser: number;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ idUser }) => {
  const [user, setUser] = useState<UserModel>({
    idUser: 0,
    dateOfBirth: new Date(),
    deliveryAddress: "",
    purchaseAddress: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    password: "",
    phoneNumber: "",
    username: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await getArtistbyId(idUser);
        setUser({
          ...response,
          dateOfBirth: new Date(response.dateOfBirth),
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [idUser]);

  if (loading) {
    return <p>Loading artist details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Artist not found.</p>;
  }

  return (
    <div className="artist-details container bg-w mb-5 ">
      <div className="artist-card">
        <div className="artist-image">
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="artist-avatar"
          />
        </div>
        <div className="artist-info">
          <h2>Thông tin về họa sĩ</h2>
          <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
          <Link to={`/author/${idUser}`} style={{ textDecoration: "none" }}>
					<button className='btn1 btn-primary1 btn-lg text-white float-end'>
						Shop All 
					</button>
				</Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
