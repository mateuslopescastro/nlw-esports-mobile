import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

import logoImg from "../../assets/logo-nlw-esports.png";

import { GameRouteParams } from "../../@types/navigation";
import { Background } from "../../components/Background";
import { DuoCard } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";
import { Heading } from "../../components/Heading";
import { THEME } from "../../theme";

import { styles } from "./styles";

export interface Duo {
  id: string;
  hourEnd: string;
  hourStart: string;
  name: string;
  useVoiceChannel: boolean;
  weekDays: string[];
  yearsPlaying: number;
}

export function Game() {
  const [duos, setDuos] = useState<Duo[]>([]);
  const [discordDuoMatch, setDiscordDuoMatch] = useState("");

  const navigation = useNavigation();
  const route = useRoute();

  const game = route.params as GameRouteParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function getUserDiscord(adId: string) {
    fetch(`http://localhost:3333/ads/${adId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoMatch(data.discord));
  }

  useEffect(() => {
    fetch(`http://localhost:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo name="chevron-thin-left" color={THEME.COLORS.CAPTION_300} />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />
          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getUserDiscord(item.id)} />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={
            duos.length > 0
              ? styles.contentList
              : {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }
          }
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncions publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          discord={discordDuoMatch}
          onClose={() => setDiscordDuoMatch("")}
          visible={!!discordDuoMatch}
        />
      </SafeAreaView>
    </Background>
  );
}
