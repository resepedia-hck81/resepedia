import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel di bagian atas */}
      <div className="carousel w-full max-h-[200px] overflow-hidden">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://cdn1-production-images-kly.akamaized.net/9bmk2g8V5iJrwaPYgto-JsFzmvQ=/0x482:5921x3820/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3005563/original/092180800_1577336519-shutterstock_320422139.jpg"
            className="w-full object-cover h-[300px]"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#slide4" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#slide2" className="btn btn-circle">
              ❯
            </Link>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/back_pic/03/53/33/45579720d58a73c.jpg"
            className="w-full object-cover h-[300px]"
          />
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
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20190222/ourmid/pngtree-black-fashion-summer-hot-pot-food-vegetable-seasoning-potseasoningsummervegetablescornonionchiliblackfashionfoodbanner-image_50572.jpg"
            className="w-full object-cover h-[300px]"
          />
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
          <img
            src="https://img.pikbest.com/backgrounds/20190227/brown-simple-flat-food-banner-background_1867052.jpg!bw700"
            className="w-full object-cover h-[300px]"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <Link href="#slide3" className="btn btn-circle">
              ❮
            </Link>
            <Link href="#slide1" className="btn btn-circle">
              ❯
            </Link>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="py-8 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Recipe List</h1>
        </div>

        <div className="container mx-auto mt-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800"
                type="search"
                placeholder="Search menu"
              />
            </div>
            <div>
              <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-800">
                <option>All Regions</option>
                <option>Region 1</option>
                <option>Region 2</option>
              </select>
            </div>
          </div>

          {/* Recipe Card Grid - Replacing Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Recipe Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://dcostseafood.id/wp-content/uploads/2023/04/Nasi-Goreng-Spesial.jpg"
                  alt="Nasi Goreng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Nasi Goreng
                </h3>
                <p className="text-sm text-gray-600 mb-3">Jawa</p>
                <Link
                  href="/recipe/1"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block w-full text-center"
                >
                  View Recipe
                </Link>
              </div>
            </div>

            {/* Recipe Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.idntimes.com/content-images/community/2022/04/resep-rendang-filosofi-rendang-makna-rendang-arti-rendang-rendang-dari-mana-makanan-indonesia-filosofi-9cde86371d7fc78c91ae80a6ffab250e-e0b9344da253b8e653bd42c7df03d6d9.jpg"
                  alt="Rendang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Rendang
                </h3>
                <p className="text-sm text-gray-600 mb-3">Sumatera Barat</p>
                <Link
                  href="/recipe/2"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block w-full text-center"
                >
                  View Recipe
                </Link>
              </div>
            </div>

            {/* Recipe Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://healthybelly.s3.amazonaws.com/product/media_1738841131_0.webp"
                  alt="Soto Ayam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Soto Ayam
                </h3>
                <p className="text-sm text-gray-600 mb-3">Jawa Timur</p>
                <Link
                  href="/recipe/3"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block w-full text-center"
                >
                  View Recipe
                </Link>
              </div>
            </div>

            {/* Recipe Card 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://radarlampung.bacakoran.co/upload/ae348f1bff19ec6f336caa2d03740c68.jpeg"
                  alt="Sate Padang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Sate Padang
                </h3>
                <p className="text-sm text-gray-600 mb-3">Sumatera Barat</p>
                <Link
                  href="/recipe/4"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block w-full text-center"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/recipes"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg inline-block"
            >
              Load More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
