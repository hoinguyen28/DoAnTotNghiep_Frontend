import { endpointBE } from "../layouts/utils/Constant";
import GenreModel from "../model/GenreModel";
import { request } from "./Request";

interface resultInterface {
   genreList: GenreModel[];
   genre: GenreModel;
}
async function getGenres(endpoint: string): Promise<resultInterface> {
   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Lấy ra danh sách thể loại
      const genreList: any = response._embedded.genres.map((genreData: any) => ({
         ...genreData,
      }));

      return { genreList: genreList, genre: response.genre };
   } catch (error) {
      console.error("Error fetching genres:", error);
      throw new Error("Không thể lấy danh sách thể loại.");
   }
}

export async function getAllGenres(): Promise<resultInterface> {
   const endpoint = endpointBE + "/genre?sort=idGenre";

   return getGenres(endpoint);
}

export async function getSingleGenre(idGenre: number): Promise<resultInterface> {
   try {
      const endpoint = endpointBE + `/genre/${idGenre}`;
      const response = await request(endpoint);

      return { genre: response, genreList: [response] };
   } catch (error) {
      console.error("Error fetching single genre:", error);
      throw new Error("Không thể lấy thể loại.");
   }
}

export async function getGenreByIdArt(idArt: number): Promise<resultInterface> {
   try {
      const endpoint = endpointBE + `/arts/${idArt}/listGenres`;

      return getGenres(endpoint);
   } catch (error) {
      console.error("Error fetching genres by art ID:", error);
      throw new Error("Không thể lấy danh sách thể loại cho tranh.");
   }
}
