import React from "react";
import { SocialIcon } from "react-social-icons";

const SocialMediaIcons = () => {
  return (
    <div>
      <div className="flex flex-row items-center gap-2 my-6">
        <SocialIcon
          url="https://www.facebook.com/ry.bealey"
          bgColor="#C74FCF"
          className="transition hover:-translate-y-1"
          style={{ height: 38, width: 38 }}
        />
        <SocialIcon
          url="https://www.instagram.com/ry.bealey/"
          bgColor="#C74FCF"
          className="transition hover:-translate-y-1"
          style={{ height: 38, width: 38 }}
        />
        <SocialIcon
          url="https://x.com/rybealey"
          bgColor="#C74FCF"
          className="transition hover:-translate-y-1"
          style={{ height: 38, width: 38 }}
        />
        <SocialIcon
          url="https://www.linkedin.com/in/ryanbealey/"
          bgColor="#C74FCF"
          className="transition hover:-translate-y-1"
          style={{ height: 38, width: 38 }}
        />
        {/* <SocialIcon url="https://www.tiktok.com/ry.php" bgColor='#C74FCF' style={{ height: 35, width: 35}} /> */}
        <SocialIcon
          network="discord"
          url="https://discordapp.com/channels/@me/ry.php/"
          bgColor="#C74FCF"
          className="transition hover:-translate-y-1"
          style={{ height: 38, width: 38 }}
        />
      </div>
    </div>
  );
};

export default SocialMediaIcons;
