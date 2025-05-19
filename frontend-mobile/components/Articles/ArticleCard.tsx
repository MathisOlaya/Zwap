// ReactNative
import { View, StyleSheet, Image, Text } from "react-native";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

// Props (type)
import { Article } from "@/types/articles";
type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: article.coverImg }} style={styles.cover} />
      <View style={styles.infos}>
        <Text style={styles.name}>{article.name}</Text>
        <Text style={styles.price}>{article.price.toPrecision(2)}.-</Text>
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
