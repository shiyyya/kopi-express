import Star from "/src/assets/icons/star-filled.svg?react";
import NewIcon from "/src/assets/icons/new.svg?react";
import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";
import "./badge.css";

function Badge({
    type,
    className = "",
}) {
    const badgeInfo = {
        popular: {
            label: "Popular",
            icon: Star,
        },

        new: {
            label: "New",
            icon: NewIcon,
        },

        soldOut: {
            label: "Sold Out",
            icon: null,
        },

        hot: {
            label: "H",
            icon: HotIcon,
        },

        iced: {
            label: "I",
            icon: IcedIcon,
        },
    };

    const currentBadge = badgeInfo[type];

    if (!currentBadge) {
        return null;
    }

    const Icon = currentBadge.icon;

    return (
        <span className={`badge badge-${type} ${className}`}>
            {Icon && (
                <Icon className="badge-icon" />
            )}

            <span className="badge-text">
                {currentBadge.label}
            </span>
        </span>
    );
}

export default Badge;