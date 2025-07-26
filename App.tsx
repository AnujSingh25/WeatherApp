import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ToastAndroid, View, ScrollView, RefreshControl, Keyboard } from 'react-native';
import { Card, TextInput } from 'react-native-paper';
import Search from "./assests/Search.svg";

const WHITE: string = "white"

function App() {

  const [search, setSearch] = useState<string>('')
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { getWeather("Delhi") }, [])

  useEffect(() => {
    if (!search) return

    const timeout = setTimeout(() => {
      getWeather(search);
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])

  const getWeather = async (city?: string) => {
    try {
      const url = "https://goweather.xyz/weather/" + city
      // const url = "https://aviationweather.gov/api/data/metar?ids=KMCI&format=json"
      const data = await fetch(url)
      const res = await data.json()
      // console.log(JSON.stringify(res));

      if (res) {
        setWeatherData(res)
      } else {
        ToastAndroid.show("Something went wrong!", 10)
      }
    } catch (error) {
      ToastAndroid.show("Something went wrong!", 10)
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getWeather} />
          }
        >

          <View style={{ elevation: 5, borderRadius: 30, backgroundColor: WHITE }}>
            <TextInput
              mode='outlined'
              placeholder="Search friends here..."
              value={search}
              style={{ backgroundColor: WHITE }}
              outlineStyle={{ borderRadius: 30, borderColor: "silver" }}
              left={<TextInput.Icon icon={() => <Search />} />}
              onChangeText={(txt: string) => {
                setSearch(txt)
                if (txt.trim() === '') {
                  getWeather("Delhi");
                }
              }}
              onSubmitEditing={() => {
                if (search.trim()) {
                  Keyboard.dismiss()
                  getWeather(search.trim())
                }
              }}
              returnKeyType="search"
            />
          </View>

          <Card style={{ marginTop: 15, backgroundColor: WHITE, padding: 15, borderRadius: 25 }} elevation={4}>
            <View style={{}}>
              <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 22 }}>{search || "Delhi"}</Text>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>{weatherData?.description}</Text>
              <Text style={{ textAlign: 'center', marginVertical: 30, fontSize: 30, color: 'blue' }}>{weatherData?.temperature}</Text>

              <View style={{ height: 0.7, backgroundColor: 'silver', marginTop: 10, marginBottom: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 17 }}>{weatherData?.wind}</Text>
                  <Text>Wind</Text>
                </View>

                <View style={{ width: 1, backgroundColor: 'silver', height: '100%', marginHorizontal: 8 }} />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 17 }}>N/A</Text>
                  <Text>Humidity</Text>
                </View>

                <View style={{ width: 1, backgroundColor: 'silver', height: '100%', marginHorizontal: 8 }} />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 17 }}>N/A</Text>
                  <Text>Precipitation</Text>
                </View>
              </View>
            </View>
          </Card>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
});

export default App;
