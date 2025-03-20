import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
} from "react-native";
import { Searchbar, Chip, ActivityIndicator, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getLeads } from "../../api/leadApi";
import Header from "../../components/common/Header";
import LeadList from "../../components/leads/LeadList";

const LeadListScreen = ({ navigation }) => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchLeads = async (pageNum = 1, refresh = false) => {
        try {
            setError(null);
            if (refresh) {
                setPage(1);
                pageNum = 1;
            }

            const response = await getLeads(pageNum, 25);
            const newLeads = response.data;

            if (refresh || pageNum === 1) {
                setLeads(newLeads);
                setFilteredLeads(newLeads);
            } else {
                setLeads([...leads, ...newLeads]);
                setFilteredLeads([...filteredLeads, ...newLeads]);
            }

            setHasMore(newLeads.length === 25);
        } catch (error) {
            console.error("Error fetching leads:", error);
            setError("Failed to load leads. Pull down to refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeads(1, true);
    };

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchLeads(nextPage);
        }
    };

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            filterLeads(activeFilter, "");
        } else {
            filterLeads(activeFilter, query);
        }
    };

    const filterLeads = (filter, query = searchQuery) => {
        setActiveFilter(filter);

        let filtered = leads;

        // Apply status filter
        if (filter !== "all") {
            filtered = leads.filter((lead) => lead.status === filter);
        }

        // Apply search query
        if (query.trim() !== "") {
            const lowercasedQuery = query.toLowerCase();
            filtered = filtered.filter(
                (lead) =>
                    `${lead.firstName} ${lead.lastName}`
                        .toLowerCase()
                        .includes(lowercasedQuery) ||
                    (lead.email &&
                        lead.email.toLowerCase().includes(lowercasedQuery)) ||
                    (lead.phone && lead.phone.includes(lowercasedQuery))
            );
        }

        setFilteredLeads(filtered);
    };

    return (
        <View style={styles.container}>
            <Header title="Leads" />

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search leads"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip
                        selected={activeFilter === "all"}
                        onPress={() => filterLeads("all")}
                        style={styles.filterChip}
                        selectedColor="#4A6FFF"
                    >
                        All
                    </Chip>
                    <Chip
                        selected={activeFilter === "new"}
                        onPress={() => filterLeads("new")}
                        style={styles.filterChip}
                        selectedColor="#4A6FFF"
                    >
                        New
                    </Chip>
                    <Chip
                        selected={activeFilter === "contacted"}
                        onPress={() => filterLeads("contacted")}
                        style={styles.filterChip}
                        selectedColor="#FFC107"
                    >
                        Contacted
                    </Chip>
                    <Chip
                        selected={activeFilter === "qualified"}
                        onPress={() => filterLeads("qualified")}
                        style={styles.filterChip}
                        selectedColor="#4CAF50"
                    >
                        Qualified
                    </Chip>
                    <Chip
                        selected={activeFilter === "converted"}
                        onPress={() => filterLeads("converted")}
                        style={styles.filterChip}
                        selectedColor="#2196F3"
                    >
                        Converted
                    </Chip>
                    <Chip
                        selected={activeFilter === "disqualified"}
                        onPress={() => filterLeads("disqualified")}
                        style={styles.filterChip}
                        selectedColor="#FF5252"
                    >
                        Disqualified
                    </Chip>
                </ScrollView>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A6FFF" />
                    <Text style={styles.loadingText}>Loading leads...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={48}
                        color="#FF5252"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredLeads}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <LeadList
                            leads={[item]}
                            navigation={navigation}
                            isLoading={false}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        hasMore ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator
                                    size="small"
                                    color="#4A6FFF"
                                />
                                <Text style={styles.footerText}>
                                    Loading more leads...
                                </Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="people-outline"
                                size={48}
                                color="#9E9E9E"
                            />
                            <Text style={styles.emptyText}>No leads found</Text>
                            <Text style={styles.emptySubtext}>
                                {searchQuery
                                    ? "Try a different search term or filter"
                                    : "Leads will appear here when your campaigns generate them"}
                            </Text>
                        </View>
                    }
                />
            )}
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
    listContainer: {
        padding: 16,
        paddingTop: 8,
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
        color: "#FF5252",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    emptySubtext: {
        marginTop: 5,
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    footerLoader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#666",
    },
});

export default LeadListScreen;
