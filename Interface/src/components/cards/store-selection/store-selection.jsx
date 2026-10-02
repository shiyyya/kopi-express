import "./store-selection.css";
import { useEffect, useState } from "react";
import Button from "/src/components/elements/button/button";
import CheckIcon from "/src/assets/icons/check.svg?react";
import { getStoreBranches } from "/src/api/store-branch.api.js";

function StoreSelection({ selectedStore, onSelect }) {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStores = async () => {
            try {
                const response = await getStoreBranches();
                setStores(response.data.branches);
            } catch (error) {
                console.error("Failed to load store branches:", error);
                setStores([]);
            } finally {
                setLoading(false);
            }
        };
        loadStores();
    }, []);

    return (
        <section className="StoreSelection">
            <h3 className="StoreSelectionTitle">Choose a Store</h3>
            <p className="StoreSelectionDescription">
                Select the store where you want to pick up your order.
            </p>
            {loading ? (
                <p>Loading stores...</p>
            ) : (
                <div className="StoreList">
                    {stores.map((store) => (
                        <Button
                            key={store.id}
                            type="button"
                            className={`StoreOption ${selectedStore?.id === store.id ? "selected" : ""}`}
                            onClick={() => onSelect(store)}
                        >
                            <span className="StoreOptionDetails">
                                <strong>{store.name}</strong>
                                <span>{store.address}</span>
                            </span>
                            <span className={selectedStore?.id === store.id ? "StoreCheck" : "StoreRadio"}>
                                {selectedStore?.id === store.id && <CheckIcon />}
                            </span>
                        </Button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default StoreSelection;