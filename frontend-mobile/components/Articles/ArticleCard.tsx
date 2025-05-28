// React Native
import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

// Props (type)
import { Article } from "@/types/articles";
type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {loading && !error && <ActivityIndicator size="small" color="#999" style={StyleSheet.absoluteFill} />}
      <Image
        source={{ uri: article.coverImg }}
        style={styles.cover}
        contentFit="cover"
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
      />
      <View style={styles.infos}>
        <Text style={styles.name}>{article.name}</Text>
        <Text style={styles.price}>{article.price.toFixed(2)}.-</Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    gap: gapV(8),
  },
  cover: {
    width: width(124),
    height: height(124),
    objectFit: "cover",
    borderRadius: 12,
  },
  infos: {},
  name: {
    fontSize: font(12),
    fontFamily: "Poppins-Regular",
  },
  price: {
    fontSize: font(12),
    fontFamily: "Poppins-Light",
  },
});

// Export component
export default ArticleCard;
