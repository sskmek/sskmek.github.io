var wcReportRes = {
    close: "Close",
    tellUsMore : "Tell us why do you want to report this video:",
    send : "Send",
    cancel : "Cancel",
    pleaseWait : "Please wait...",
    removeVideoTitle : "Remove video from your listing:",
    removeSelectedVideo : "Remove the selected video",
    removeAllVideos : "Remove all videos - Disable video review for this listing",
    noNewVideos : "New Videos will not be added to this listing in the future",
    removeRequestSubmitted : "Your video removal request has been submitted. The video will disappear from your listing within 15 minutes.",
    removeRequestFailure : "Your video removal request has not been submitted due to a failure, please try later !",
    //loginToRemove : "To remove the video from your listing please log in and click the trash can icon that will appear on the video",
    submitMessageSuccess: "Your report has been submitted!",
    submitMessageFailure: "Your report has not been submitted due to a failure , please try later!",
    ok : "OK",
    structure: [
        {
            id: "opt1",
            key: "does_not_match_product",
            title: "Video doesn\'t match product",
            username: false,
            comment: false
        },
        {
            id: "opt2",
            key: "inaccurate_or_misleading",
            title: "Video is inaccurate or misleading",
            username: false,
            comment: false
        },
        {
            id: "opt3",
            key: "infringes_my_rights",
            title : "Video infringes my rights:",
            options: [
                {
                    id: "opt3_1",
                    key: "trademark_infringement",
                    title : "Trademark infringement",
                    username: false,
                    comment: false
                },
                {
                    id: "opt3_2",
                    key: "copyright_infringement",
                    title : "Copyright infringement:",
                    options: [
                        {
                            id: "opt3_2_1",
                            key: "related_to_music",
                            title : "Related to music",
                            username: false,
                            comment: false
                        },
                        {
                            id: "opt3_2_2",
                            key: "related_to_visual_content",
                            title : "Related to visual content",
                            username: false,
                            comment: false
                        },
                        {
                            id: "opt3_2_3",
                            key: "related_to_both_music_and_visual_content",
                            title : "Related to both music/visual content",
                            username: false,
                            comment: false
                        }
                    ]
                },
                {
                    id: "opt3_3",
                    key: "other_ip_rights",
                    title : "Other IP rights",
                    username: false,
                    comment: false
                }
            ]
        },
        {
            id: "opt4",
            key: "poor_quality",
            title: "Video is of poor quality",
            username: false,
            comment: false
        },
        {
            id: "opt5",
            key: "offensive_or_inappropriate",
            title : "Video is offensive or inappropriate",
            username: false,
            comment: false
        },
        {
            id: "opt6",
            key: "other",
            title: "Other",
            username: false,
            comment: true
        }
    ]
};