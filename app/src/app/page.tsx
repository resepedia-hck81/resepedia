"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRecipes, getRegions } from "./action";
import CardRecipe from "./components/CardRecipe";

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
  const [page, setPage] = useState(1);

  async function fetchRecipes() {
    const response = await getRecipes(search, region, page);
    if (response.error) {
      return <h1>RECIPES NOT FOUND</h1>;
    }
    const data: IRecipeData = response.data;
    if (page === 1) {
      setRecipes(data);
    } else {
      setRecipes((prev) => ({
        ...prev,
        result: [...prev.result, ...data.result],
      }));
    }
  }

  async function fetchRegions() {
    const response = await getRegions();
    if (response.error) {
      return <h1>REGIONS NOT FOUND</h1>;
    }
    const data: IRegion[] = response.data;
    setRegions(data);
  }

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [search, region, page]);

  useEffect(() => {
    setPage(1);
  }, [search, region]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel di bagian atas */}
      <div className="carousel w-full max-h-[150px] overflow-hidden">
        <div id="slide1" className="carousel-item relative w-full">
          <div className="w-full h-[300px] relative">
            <Image
              src="https://cdn1-production-images-kly.akamaized.net/9bmk2g8V5iJrwaPYgto-JsFzmvQ=/0x482:5921x3820/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3005563/original/092180800_1577336519-shutterstock_320422139.jpg"
              alt="Food Banner 1"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#slide2" className="btn btn-circle">
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
              className="object-cover"
            />
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#slide1" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#slide3" className="btn btn-circle">
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
              className="object-cover"
            />
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#slide2" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#slide4" className="btn btn-circle">
              ❯
            </Link>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <div className="w-full h-[300px] relative">
            <Image
              src="https://img.pikbest.com/backgrounds/20190227/brown-simple-flat-food-banner-background_1867052.jpg!bw700"
              alt="Food Banner 4"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#slide3" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#" className="btn btn-circle">
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

          {/* Recipe Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Recipe Card */}
            {recipes.result.map((recipe) => (
              <CardRecipe key={recipe._id} recipe={recipe} />
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                setPage(page + 1);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg inline-block"
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
