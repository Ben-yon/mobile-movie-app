import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
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
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10
          }}
          className="pb-32"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListHeaderComponent={
            <View>
              <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
              <SearchBar
                placeholder="Search for a movie"
                onPress={() => router.push("/search")}
              />
              {
                trendingMovies && trendingMovies.length > 0 && (
                <View className="mt-10 mb-5">
                  <Text className="text-lg text-white font-bold mb-3">
                    Trending Movies
                  </Text>
                  <FlatList
                    data={trendingMovies}
                    renderItem={ ( {item, index } ) => (
                      <TrendingCard movie={item} index={index}/>
                    )}
                    keyExtractor={(item) => item.movie_id?.toString() || item.$id?.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={
                      () => <View className="w-4"/>
                    }
                    contentContainerStyle={{
                      gap: 20,
                      paddingRight: 5
                    }}
                    scrollEnabled={true}
                  />
                </View>
                )
              }
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
