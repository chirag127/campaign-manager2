import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
} from "react-native";
import {
    FAB,
    Searchbar,
    Chip,
    ActivityIndicator,
    Text,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getCampaigns } from "../../api/campaignApi";
import Header from "../../components/common/Header";
import CampaignList from "../../components/campaigns/CampaignList";

const CampaignListScreen = ({ navigation }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchCampaigns = async (pageNum = 1, refresh = false) => {
        try {
            setError(null);
            if (refresh) {
                setPage(1);
                pageNum = 1;
            }

            const response = await getCampaigns(pageNum, 10);
            const newCampaigns = response.data;

            if (refresh || pageNum === 1) {
                setCampaigns(newCampaigns);
                setFilteredCampaigns(newCampaigns);
            } else {
                setCampaigns([...campaigns, ...newCampaigns]);
                setFilteredCampaigns([...filteredCampaigns, ...newCampaigns]);
            }

            setHasMore(newCampaigns.length === 10);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            setError("Failed to load campaigns. Pull down to refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCampaigns(1, true);
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchCampaigns(nextPage);
        }
    };

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            filterCampaigns(activeFilter, "");
        } else {
            filterCampaigns(activeFilter, query);
        }
    };

    const filterCampaigns = (filter, query = searchQuery) => {
        setActiveFilter(filter);

        let filtered = campaigns;

        // Apply status filter
        if (filter !== "all") {
            filtered = campaigns.filter(
                (campaign) => campaign.status === filter
            );
        }

        // Apply search query
        if (query.trim() !== "") {
            const lowercasedQuery = query.toLowerCase();
            filtered = filtered.filter(
                (campaign) =>
                    campaign.name.toLowerCase().includes(lowercasedQuery) ||
                    (campaign.description &&
                        campaign.description
                            .toLowerCase()
                            .includes(lowercasedQuery))
            );
        }

        setFilteredCampaigns(filtered);
    };

    return (
        <View style={styles.container}>
            <Header title="Campaigns" />

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search campaigns"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip
                        selected={activeFilter === "all"}
                        onPress={() => filterCampaigns("all")}
                        style={styles.filterChip}
                        selectedColor="#4A6FFF"
                    >
                        All
                    </Chip>
                    <Chip
                        selected={activeFilter === "active"}
                        onPress={() => filterCampaigns("active")}
                        style={styles.filterChip}
                        selectedColor="#4CAF50"
                    >
                        Active
                    </Chip>
                    <Chip
                        selected={activeFilter === "paused"}
                        onPress={() => filterCampaigns("paused")}
                        style={styles.filterChip}
                        selectedColor="#FFC107"
                    >
                        Paused
                    </Chip>
                    <Chip
                        selected={activeFilter === "draft"}
                        onPress={() => filterCampaigns("draft")}
                        style={styles.filterChip}
                        selectedColor="#9E9E9E"
                    >
                        Draft
                    </Chip>
                    <Chip
                        selected={activeFilter === "completed"}
                        onPress={() => filterCampaigns("completed")}
                        style={styles.filterChip}
                        selectedColor="#2196F3"
                    >
                        Completed
                    </Chip>
                </ScrollView>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A6FFF" />
                    <Text style={styles.loadingText}>Loading campaigns...</Text>
                </View>
            ) : (
                <CampaignList
                    campaigns={filteredCampaigns}
                    navigation={navigation}
                    isLoading={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={loadMore}
                />
            )}

            <FAB
                style={styles.fab}
                icon="plus"
                color="#fff"
                onPress={() => navigation.navigate("CampaignCreate")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    searchbar: {
        elevation: 2,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    filterChip: {
        marginRight: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#4A6FFF",
    },
});

export default CampaignListScreen;
