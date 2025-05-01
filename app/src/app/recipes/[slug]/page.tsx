"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";

// Contoh data resep (nantinya bisa diambil dari database)
const recipeData = {
  1: {
    id: 1,
    name: "Nasi Goreng",
    imageUrl:
      "https://dcostseafood.id/wp-content/uploads/2023/04/Nasi-Goreng-Spesial.jpg",
    Region: { name: "Jawa" },
    ingredient1: "Nasi putih",
    measurement1: "2 piring",
    ingredient2: "Telur",
    measurement2: "2 butir",
    ingredient3: "Bawang merah",
    measurement3: "5 siung",
    ingredient4: "Bawang putih",
    measurement4: "3 siung",
    ingredient5: "Cabai merah",
    measurement5: "5 buah",
    ingredient6: "Kecap manis",
    measurement6: "2 sdm",
    ingredient7: "Garam",
    measurement7: "1 sdt",
    ingredient8: "Kaldu bubuk",
    measurement8: "1 sdt",
    ingredient9: "Daun bawang",
    measurement9: "1 batang",
    ingredient10: "Minyak goreng",
    measurement10: "3 sdm",
    instructions:
      "Haluskan bawang merah, bawang putih, dan cabai merah.\nPanaskan minyak goreng, tumis bumbu halus hingga harum.\nMasukkan telur, aduk hingga matang.\nTambahkan nasi putih, aduk rata.\nBeri kecap manis, garam, dan kaldu bubuk. Aduk rata.\nMasukkan daun bawang yang sudah diiris halus, aduk sebentar.\nAngkat dan sajikan dengan pelengkap seperti kerupuk, acar, dan irisan mentimun.",
  },
  2: {
    id: 2,
    name: "Rendang",
    imageUrl:
      "https://asset.kompas.com/crops/MrdYwlwp5-Q_-xBBVrYQqhkCw0E=/0x282:1000x949/750x500/data/photo/2020/01/29/5e30ff97c60ec.jpg",
    Region: { name: "Sumatera Barat" },
    ingredient1: "Daging sapi",
    measurement1: "1 kg",
    ingredient2: "Santan kental",
    measurement2: "1 liter",
    ingredient3: "Bawang merah",
    measurement3: "10 siung",
    ingredient4: "Bawang putih",
    measurement4: "5 siung",
    ingredient5: "Cabai merah",
    measurement5: "15 buah",
    ingredient6: "Serai",
    measurement6: "3 batang",
    ingredient7: "Daun jeruk",
    measurement7: "5 lembar",
    ingredient8: "Lengkuas",
    measurement8: "3 cm",
    ingredient9: "Jahe",
    measurement9: "3 cm",
    ingredient10: "Garam",
    measurement10: "secukupnya",
    instructions:
      "Potong daging sapi menjadi ukuran sedang.\nHaluskan bawang merah, bawang putih, cabai merah, lengkuas, dan jahe.\nPanaskan minyak, tumis bumbu halus, serai yang digeprek, dan daun jeruk hingga harum.\nMasukkan daging sapi, aduk hingga berubah warna.\nTuangkan santan, biarkan hingga mendidih sambil diaduk perlahan.\nMasak dengan api kecil hingga santan menyusut dan daging empuk (sekitar 3-4 jam).\nAduk sesekali agar tidak gosong.\nRendang siap disajikan ketika kuahnya sudah mengental dan berwarna cokelat kehitaman.",
  },
  3: {
    id: 3,
    name: "Soto Ayam",
    imageUrl:
      "https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2022/06/14/844865799.jpg",
    Region: { name: "Jawa Timur" },
    ingredient1: "Ayam",
    measurement1: "1 ekor",
    ingredient2: "Bawang merah",
    measurement2: "8 siung",
    ingredient3: "Bawang putih",
    measurement3: "5 siung",
    ingredient4: "Jahe",
    measurement4: "2 cm",
    ingredient5: "Kunyit",
    measurement5: "3 cm",
    ingredient6: "Sereh",
    measurement6: "2 batang",
    ingredient7: "Daun jeruk",
    measurement7: "4 lembar",
    ingredient8: "Daun salam",
    measurement8: "2 lembar",
    ingredient9: "Garam",
    measurement9: "secukupnya",
    ingredient10: "Air",
    measurement10: "2 liter",
    instructions:
      "Rebus ayam dengan daun salam, sereh, dan jahe hingga empuk. Angkat ayam, suwir-suwir dagingnya. Sisihkan kaldu.\nHaluskan bawang merah, bawang putih, dan kunyit.\nTumis bumbu halus, daun jeruk hingga harum.\nMasukkan bumbu tumis ke dalam kaldu, tambahkan garam secukupnya.\nHidangkan dengan taburan ayam suwir, telur rebus, kol, tauge, daun bawang, dan bawang goreng.\nSajikan dengan nasi, jeruk nipis, dan sambal.",
  },
  4: {
    id: 4,
    name: "Sate Padang",
    imageUrl:
      "https://img.okezone.com/content/2023/01/25/298/2755187/resep-sate-padang-sajian-makan-siang-yang-menggoda-lidah-Fl78rnXNdg.jpg",
    Region: { name: "Sumatera Barat" },
    ingredient1: "Daging sapi",
    measurement1: "500 gram",
    ingredient2: "Tusuk sate",
    measurement2: "secukupnya",
    ingredient3: "Bawang merah",
    measurement3: "8 siung",
    ingredient4: "Bawang putih",
    measurement4: "4 siung",
    ingredient5: "Cabai merah",
    measurement5: "10 buah",
    ingredient6: "Jahe",
    measurement6: "2 cm",
    ingredient7: "Kunyit",
    measurement7: "2 cm",
    ingredient8: "Jintan",
    measurement8: "1 sdt",
    ingredient9: "Tepung beras",
    measurement9: "2 sdm",
    ingredient10: "Air",
    measurement10: "500 ml",
    instructions:
      "Potong daging sapi menjadi dadu kecil-kecil.\nTusukkan potongan daging ke tusuk sate.\nRebus daging sate sebentar, angkat dan sisihkan.\nHaluskan bawang merah, bawang putih, cabai merah, jahe, kunyit, dan jintan.\nRebus air, masukkan bumbu halus, biarkan mendidih.\nLarutkan tepung beras dengan sedikit air, masukkan ke dalam kuah.\nMasak hingga kuah mengental.\nBakar sate hingga matang.\nSiram sate dengan kuah kental, sajikan dengan ketupat atau lontong.",
  },
};

export default function RecipeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slugValue = unwrappedParams.slug;

  const [recipe, setRecipe] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<Record<string, string[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data
    const fetchData = () => {
      const recipeId = parseInt(slugValue, 10);
      // Mengambil data resep berdasarkan ID
      const data = recipeData[recipeId as keyof typeof recipeData];

      if (data) {
        setRecipe(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [slugValue]);

  const generateAlternatives = () => {
    // Contoh alternatif bahan dengan tepat 3 opsi untuk setiap bahan
    const alt: Record<string, string[]> = {
      "Bawang merah": ["Bawang bombay", "Daun bawang", "Bawang merah bubuk"],
      "Bawang putih": ["Bawang putih bubuk", "Shallot", "Garlic paste"],
      "Cabai merah": ["Cabai rawit", "Cabai bubuk", "Paprika"],
      "Santan kental": ["Santan instan", "Krim kelapa", "Yogurt"],
      "Tepung beras": ["Tepung sagu", "Tepung maizena", "Tepung tapioka"],
      "Nasi putih": ["Nasi merah", "Nasi shirataki", "Quinoa"],
      Telur: ["Telur puyuh", "Tahu", "Telur bebek"],
      "Daging sapi": ["Daging ayam", "Daging kambing", "Protein nabati"],
      Ayam: ["Daging sapi", "Daging kambing", "Tahu atau tempe"],
      Jahe: ["Jahe bubuk", "Lengkuas", "Kapulaga"],
      Kunyit: ["Kunyit bubuk", "Saffron", "Kunyit asam jamu"],
      Sereh: ["Sereh bubuk", "Daun kari", "Jeruk purut"],
      Serai: ["Sereh bubuk", "Daun kari", "Jeruk purut"],
      "Daun jeruk": ["Kulit jeruk", "Daun kari", "Jeruk nipis"],
      "Daun salam": ["Bay leaf", "Daun pandan", "Lengkuas"],
      Garam: ["Garam himalaya", "Kecap asin", "Kaldu bubuk"],
      "Minyak goreng": ["Minyak zaitun", "Minyak kelapa", "Margarin"],
      "Kecap manis": ["Saus tiram", "Gula jawa cair", "Madu"],
      "Kaldu bubuk": ["Kaldu jamur", "MSG", "Garam himalaya"],
      "Daun bawang": ["Bawang bombay", "Seledri", "Daun ketumbar"],
      Jintan: ["Jintan bubuk", "Adas", "Ketumbar"],
      Lengkuas: ["Jahe", "Lengkuas bubuk", "Kunyit"],
      Air: ["Kaldu ayam", "Kaldu sapi", "Air kelapa"],
      "Tusuk sate": ["Tusuk bambu", "Tusuk stainless", "Batang serai"],
    };

    setAlternatives(alt);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container my-5 text-center">
        <h1>Resep tidak ditemukan</h1>
        <Link href="/" className="btn btn-primary mt-3">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5 px-4 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-block text-gray-700 hover:text-red-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{recipe.name}</h1>
        <div
          className="mb-6 relative mx-auto"
          style={{ maxWidth: "600px", width: "100%", height: "400px" }}
        >
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            priority
            className="rounded-lg shadow-md object-cover"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Region</h2>
        <p className="text-gray-600">{recipe.Region?.name}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ingredients</h2>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            onClick={generateAlternatives}
          >
            Generate Alternative Ingredients
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-2 border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300 whitespace-nowrap">
                  Measurement
                </th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300 whitespace-nowrap">
                  Ingredient
                </th>
                {Object.keys(alternatives).length > 0 && (
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-2 border-gray-300">
                    Alternative Ingredients
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, index) => {
                const ingredient = recipe[`ingredient${index + 1}`];
                const measurement = recipe[`measurement${index + 1}`];
                const alternative = alternatives[ingredient];

                if (ingredient && measurement) {
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 border-2 border-gray-300 whitespace-nowrap text-gray-700">
                        {measurement}
                      </td>
                      <td className="px-4 py-3 border-2 border-gray-300 whitespace-nowrap text-gray-700 font-medium">
                        {ingredient}
                      </td>
                      {Object.keys(alternatives).length > 0 && (
                        <td className="px-4 py-3 border-2 border-gray-300">
                          {alternative && (
                            <div className="flex flex-wrap gap-2">
                              {alternative.map((alt, i) => (
                                <span
                                  key={i}
                                  className="bg-red-50 text-red-700 text-sm px-2 py-1 rounded-md border border-red-100"
                                >
                                  {alt}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Instructions
        </h2>
        <div className="space-y-3 text-gray-700">
          {recipe.instructions
            ?.split("\n")
            .map((sentence: string, index: number) => (
              <p key={index} className="text-justify">
                {sentence.trim()}
              </p>
            ))}
        </div>
      </div>

      <div className="text-center mt-10 mb-6">
        <Link
          href="/editrecipe"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md inline-block"
        >
          Edit Recipe
        </Link>
      </div>
    </div>
  );
}
