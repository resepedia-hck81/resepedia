"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRecipes, getRegions } from "./action";
import CardRecipe from "./components/CardRecipe";
import InfiniteScroll from "react-infinite-scroll-component";

interface IRecipeData {
  page: number;
  totalPages: number;
  dataCount: number;
  totalDataCount: number;
  result: IRecipe[];
}

export interface IRecipe {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  ingredients: IIngredient[];
  instruction: string;
  RegionId: string;
  UserId: string;
  createdAt: string;
  updatedAt: string;
  region: string;
  author: string;
}

export interface IIngredient {
  name: string;
  measurement: string;
}

export interface IRegion {
  _id: string;
  name: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipeData>({
    page: 1,
    totalPages: 0,
    dataCount: 12,
    totalDataCount: 0,
    result: [],
  });

  const [regions, setRegions] = useState<IRegion[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  

  async function fetchRecipes() {
    const response = await getRecipes(search, region, recipes.page);
    if (response.error) {
      setLoading(false);
      return <h1>RECIPES NOT FOUND</h1>;
    }
    const data: IRecipeData = response.data;
    if (recipes.page === 1) {
      setRecipes(data);
    } else {
      setRecipes((prev) => ({
        ...prev,
        result: [...prev.result, ...data.result],
      }));
    }
    setLoading(false);
  }

  async function fetchRegions() {
    setLoading(true);
    const response = await getRegions();
    if (response.error) {
      setLoading(false);
      return <h1>REGIONS NOT FOUND</h1>;
    }
    const data: IRegion[] = response.data;
    setRegions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [recipes.page]);

  useEffect(() => {
    setRecipes((prev) => ({
      ...prev,
      page: 1,
      result: [],
    }));
    fetchRecipes();
  }, [search, region]);

  return (
    <div className="flex flex-col min-h-screen">
{/* Carousel */}
<div className="carousel w-full max-h-[150px] overflow-hidden">
  <div id="slide1" className="carousel-item relative w-full">
    <div className="w-full h-[300px] relative">
      <Image
        src="https://cdn1-production-images-kly.akamaized.net/9bmk2g8V5iJrwaPYgto-JsFzmvQ=/0x482:5921x3820/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3005563/original/092180800_1577336519-shutterstock_320422139.jpg"
        alt="Food Banner 1"
        fill
        className="object-cover brightness-70"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-75px)' }}>
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-4xl lg:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-['Playfair_Display']">
            Let's Get Premium!
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] font-['Montserrat']">
            Unlock unlimited generate recipes today!
          </p>
        </div>
      </div>
    </div>
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <Link href="#" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❮
      </Link>
      <Link href="#slide2" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❯
      </Link>
    </div>
  </div>
  
  <div id="slide2" className="carousel-item relative w-full">
    <div className="w-full h-[300px] relative">
      <Image
        src="https://png.pngtree.com/thumb_back/fh260/back_pic/03/53/33/45579720d58a73c.jpg"
        alt="Food Banner 2"
        fill
        className="object-cover brightness-70"
      />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-75px)' }}>
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-4xl lg:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-['Playfair_Display']">
            Let's Get Premium!
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] font-['Montserrat']">
            Discover alternative ingredients!
          </p>
        </div>
      </div>
    </div>
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <Link href="#slide1" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❮
      </Link>
      <Link href="#slide3" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❯
      </Link>
    </div>
  </div>
  
  <div id="slide3" className="carousel-item relative w-full">
    <div className="w-full h-[300px] relative">
      <Image
        src="https://png.pngtree.com/thumb_back/fh260/background/20190222/ourmid/pngtree-black-fashion-summer-hot-pot-food-vegetable-seasoning-potseasoningsummervegetablescornonionchiliblackfashionfoodbanner-image_50572.jpg"
        alt="Food Banner 3"
        fill
        className="object-cover brightness-70"
      />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-75px)' }}>
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-4xl lg:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-['Playfair_Display']">
            Let's Get Premium!
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] font-['Montserrat']">
            Make you a recipe base only on a photo?!
          </p>
        </div>
      </div>
    </div>
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <Link href="#slide2" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❮
      </Link>
      <Link href="#slide3" className="btn btn-circle bg-white border-none hover:bg-black/50">
        ❯
      </Link>
    </div>
  </div>
  
</div>

      {/* Page Content */}
      <div className="py-8 px-6">
        <div className="text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Recipe List
            </h1>
          </div>
        </div>

        <div className="container mx-auto mt-4 px-4">
          <div className="flex justify-center mb-8">
            <div className="flex gap-4 items-center justify-center w-full">
              <input
                className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 w-1/2"
                type="search"
                placeholder="Search menu"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select border border-gray-300 rounded-full px-4 py-[0.6rem] text-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800 w-1/4"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value={""}>All Regions</option>
                {regions.map((region) => (
                  <option key={region._id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-bars loading-lg text-red-600"></span>
            </div>
          )}

          {/* Recipe Card Grid */}
          {!loading && (
            <InfiniteScroll
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              dataLength={recipes.result.length}
              next={() =>
                setRecipes((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              hasMore={recipes.page < recipes.totalPages}
              loader={null}
              scrollThreshold={0.9}
            >
              {recipes.result.map((recipe) => (
                <CardRecipe key={recipe._id} recipe={recipe} />
              ))}
            </InfiniteScroll>
          )}
          {recipes.page < recipes.totalPages && (
            <div className="w-full flex justify-center mt-6">
              <span className="loading loading-bars loading-lg text-red-600"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
