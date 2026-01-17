import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies)

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      {moviesLoading || trendingLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError || trendingError ? (
        <Text> Error: {moviesError?.message || trendingError?.message} </Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={( {item } ) => (
            <MovieCard {...item}/>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10
          }}
          className="px-5 pb-32"
          scrollEnabled={true}
          ListHeaderComponent={
            <View className="px-0">
              <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
              <SearchBar
                placeholder="Search for a movie"
                onPress={() => router.push("/search")}
              />
              {trendingMovies && (
                <>
                  <View className="mt-10">
                    <Text className="text-lg text-white font-bold">Trending Movies</Text>
                  </View>
                  <FlatList
                    data={trendingMovies}
                    renderItem={({ item }) => (
                      <Text className="text-white text-sm">{ item.title }</Text>
                    )}
                    keyExtractor={(item) => item.movie_id?.toString()}
                    scrollEnabled={false}
                  />
                </>
              )}
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
