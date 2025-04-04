import styles from "../styles/OptionCard.module.css";
import InfoIcon from "../assets/Info.svg";

export const OptionCard = ({ closeLoginCard }: { closeLoginCard: () => void }) => {
    return (
        <>
            <div className="w-full xs:max-w-full xs:h-full md:max-w-[26rem] md:h-[27rem]
            md:max-w-[24rem] md:h-[25rem] lg:max-w-[26rem] lg:h-[27rem] bg-white rounded-lg shadow-lg relative">
                <button className={styles.dismiss} onClick={closeLoginCard} type="button">
                    <p>×</p>
                </button>

                <div className={styles.header}>
                    <div className={styles.image}>
                        <img src={InfoIcon}  alt="Info Icon" width="30rem" />
                    </div>

                    <div className={styles.content}>
                        <span className={styles.title}>Join Relay</span>
                        <p className={styles.message}>
                            Join this relay! We'll update your metadata or fetch your data to back up here.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.extension} type="button">Join with extension</button>
                        <button className={styles.sync} type="button">Sync to back up</button>
                    </div>
                </div>
            </div>
        </>
    );
};
