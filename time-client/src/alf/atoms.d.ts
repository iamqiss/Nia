import { type StyleProp, type ViewStyle } from 'react-native';
export declare const atoms: {
    readonly debug: {
        readonly borderColor: "red";
        readonly borderWidth: 1;
    };
    readonly fixed: {
        readonly position: "absolute";
    };
    readonly absolute: {
        readonly position: "absolute";
    };
    readonly relative: {
        readonly position: "relative";
    };
    readonly static: {
        readonly position: "static";
    };
    readonly sticky: any;
    readonly inset_0: {
        readonly top: 0;
        readonly left: 0;
        readonly right: 0;
        readonly bottom: 0;
    };
    readonly top_0: {
        readonly top: 0;
    };
    readonly right_0: {
        readonly right: 0;
    };
    readonly bottom_0: {
        readonly bottom: 0;
    };
    readonly left_0: {
        readonly left: 0;
    };
    readonly z_10: {
        readonly zIndex: 10;
    };
    readonly z_20: {
        readonly zIndex: 20;
    };
    readonly z_30: {
        readonly zIndex: 30;
    };
    readonly z_40: {
        readonly zIndex: 40;
    };
    readonly z_50: {
        readonly zIndex: 50;
    };
    readonly overflow_visible: {
        readonly overflow: "visible";
    };
    readonly overflow_x_visible: {
        readonly overflowX: "visible";
    };
    readonly overflow_y_visible: {
        readonly overflowY: "visible";
    };
    readonly overflow_hidden: {
        readonly overflow: "hidden";
    };
    readonly overflow_x_hidden: {
        readonly overflowX: "hidden";
    };
    readonly overflow_y_hidden: {
        readonly overflowY: "hidden";
    };
    /**
     * @platform web
     */
    readonly overflow_auto: any;
    readonly w_full: {
        readonly width: "100%";
    };
    readonly h_full: {
        readonly height: "100%";
    };
    readonly h_full_vh: any;
    readonly max_w_full: {
        readonly maxWidth: "100%";
    };
    readonly max_h_full: {
        readonly maxHeight: "100%";
    };
    /**
     * Used for the outermost components on screens, to ensure that they can fill
     * the screen and extend beyond.
     */
    readonly util_screen_outer: StyleProp<ViewStyle>;
    readonly bg_transparent: {
        readonly backgroundColor: "transparent";
    };
    readonly rounded_0: {
        readonly borderRadius: 0;
    };
    readonly rounded_2xs: {
        readonly borderRadius: any;
    };
    readonly rounded_xs: {
        readonly borderRadius: any;
    };
    readonly rounded_sm: {
        readonly borderRadius: any;
    };
    readonly rounded_md: {
        readonly borderRadius: any;
    };
    readonly rounded_lg: {
        readonly borderRadius: any;
    };
    readonly rounded_full: {
        readonly borderRadius: any;
    };
    readonly gap_0: {
        readonly gap: 0;
    };
    readonly gap_2xs: {
        readonly gap: any;
    };
    readonly gap_xs: {
        readonly gap: any;
    };
    readonly gap_sm: {
        readonly gap: any;
    };
    readonly gap_md: {
        readonly gap: any;
    };
    readonly gap_lg: {
        readonly gap: any;
    };
    readonly gap_xl: {
        readonly gap: any;
    };
    readonly gap_2xl: {
        readonly gap: any;
    };
    readonly gap_3xl: {
        readonly gap: any;
    };
    readonly gap_4xl: {
        readonly gap: any;
    };
    readonly gap_5xl: {
        readonly gap: any;
    };
    readonly flex: {
        readonly display: "flex";
    };
    readonly flex_col: {
        readonly flexDirection: "column";
    };
    readonly flex_row: {
        readonly flexDirection: "row";
    };
    readonly flex_col_reverse: {
        readonly flexDirection: "column-reverse";
    };
    readonly flex_row_reverse: {
        readonly flexDirection: "row-reverse";
    };
    readonly flex_wrap: {
        readonly flexWrap: "wrap";
    };
    readonly flex_nowrap: {
        readonly flexWrap: "nowrap";
    };
    readonly flex_0: {
        readonly flex: any;
    };
    readonly flex_1: {
        readonly flex: 1;
    };
    readonly flex_grow: {
        readonly flexGrow: 1;
    };
    readonly flex_grow_0: {
        readonly flexGrow: 0;
    };
    readonly flex_shrink: {
        readonly flexShrink: 1;
    };
    readonly flex_shrink_0: {
        readonly flexShrink: 0;
    };
    readonly justify_start: {
        readonly justifyContent: "flex-start";
    };
    readonly justify_center: {
        readonly justifyContent: "center";
    };
    readonly justify_between: {
        readonly justifyContent: "space-between";
    };
    readonly justify_end: {
        readonly justifyContent: "flex-end";
    };
    readonly align_center: {
        readonly alignItems: "center";
    };
    readonly align_start: {
        readonly alignItems: "flex-start";
    };
    readonly align_end: {
        readonly alignItems: "flex-end";
    };
    readonly align_baseline: {
        readonly alignItems: "baseline";
    };
    readonly align_stretch: {
        readonly alignItems: "stretch";
    };
    readonly self_auto: {
        readonly alignSelf: "auto";
    };
    readonly self_start: {
        readonly alignSelf: "flex-start";
    };
    readonly self_end: {
        readonly alignSelf: "flex-end";
    };
    readonly self_center: {
        readonly alignSelf: "center";
    };
    readonly self_stretch: {
        readonly alignSelf: "stretch";
    };
    readonly self_baseline: {
        readonly alignSelf: "baseline";
    };
    readonly text_left: {
        readonly textAlign: "left";
    };
    readonly text_center: {
        readonly textAlign: "center";
    };
    readonly text_right: {
        readonly textAlign: "right";
    };
    readonly text_2xs: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_xs: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_sm: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_md: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_lg: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_xl: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_2xl: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_3xl: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_4xl: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly text_5xl: {
        readonly fontSize: any;
        readonly letterSpacing: any;
    };
    readonly leading_tight: {
        readonly lineHeight: 1.15;
    };
    readonly leading_snug: {
        readonly lineHeight: 1.3;
    };
    readonly leading_normal: {
        readonly lineHeight: 1.5;
    };
    readonly tracking_normal: {
        readonly letterSpacing: any;
    };
    readonly font_normal: {
        readonly fontWeight: any;
    };
    readonly font_medium: {
        readonly fontWeight: any;
    };
    readonly font_bold: {
        readonly fontWeight: any;
    };
    readonly font_heavy: {
        readonly fontWeight: any;
    };
    readonly italic: {
        readonly fontStyle: "italic";
    };
    readonly border_0: {
        readonly borderWidth: 0;
    };
    readonly border_t_0: {
        readonly borderTopWidth: 0;
    };
    readonly border_b_0: {
        readonly borderBottomWidth: 0;
    };
    readonly border_l_0: {
        readonly borderLeftWidth: 0;
    };
    readonly border_r_0: {
        readonly borderRightWidth: 0;
    };
    readonly border_x_0: {
        readonly borderLeftWidth: 0;
        readonly borderRightWidth: 0;
    };
    readonly border_y_0: {
        readonly borderTopWidth: 0;
        readonly borderBottomWidth: 0;
    };
    readonly border: {
        readonly borderWidth: any;
    };
    readonly border_t: {
        readonly borderTopWidth: any;
    };
    readonly border_b: {
        readonly borderBottomWidth: any;
    };
    readonly border_l: {
        readonly borderLeftWidth: any;
    };
    readonly border_r: {
        readonly borderRightWidth: any;
    };
    readonly border_x: {
        readonly borderLeftWidth: any;
        readonly borderRightWidth: any;
    };
    readonly border_y: {
        readonly borderTopWidth: any;
        readonly borderBottomWidth: any;
    };
    readonly border_transparent: {
        readonly borderColor: "transparent";
    };
    readonly curve_circular: any;
    readonly curve_continuous: any;
    readonly shadow_sm: {
        readonly shadowRadius: 8;
        readonly shadowOpacity: 0.1;
        readonly elevation: 8;
    };
    readonly shadow_md: {
        readonly shadowRadius: 16;
        readonly shadowOpacity: 0.1;
        readonly elevation: 16;
    };
    readonly shadow_lg: {
        readonly shadowRadius: 32;
        readonly shadowOpacity: 0.1;
        readonly elevation: 24;
    };
    readonly p_0: {
        readonly padding: 0;
    };
    readonly p_2xs: {
        readonly padding: any;
    };
    readonly p_xs: {
        readonly padding: any;
    };
    readonly p_sm: {
        readonly padding: any;
    };
    readonly p_md: {
        readonly padding: any;
    };
    readonly p_lg: {
        readonly padding: any;
    };
    readonly p_xl: {
        readonly padding: any;
    };
    readonly p_2xl: {
        readonly padding: any;
    };
    readonly p_3xl: {
        readonly padding: any;
    };
    readonly p_4xl: {
        readonly padding: any;
    };
    readonly p_5xl: {
        readonly padding: any;
    };
    readonly px_0: {
        readonly paddingLeft: 0;
        readonly paddingRight: 0;
    };
    readonly px_2xs: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_xs: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_sm: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_md: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_lg: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_xl: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_2xl: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_3xl: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_4xl: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly px_5xl: {
        readonly paddingLeft: any;
        readonly paddingRight: any;
    };
    readonly py_0: {
        readonly paddingTop: 0;
        readonly paddingBottom: 0;
    };
    readonly py_2xs: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_xs: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_sm: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_md: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_lg: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_xl: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_2xl: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_3xl: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_4xl: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly py_5xl: {
        readonly paddingTop: any;
        readonly paddingBottom: any;
    };
    readonly pt_0: {
        readonly paddingTop: 0;
    };
    readonly pt_2xs: {
        readonly paddingTop: any;
    };
    readonly pt_xs: {
        readonly paddingTop: any;
    };
    readonly pt_sm: {
        readonly paddingTop: any;
    };
    readonly pt_md: {
        readonly paddingTop: any;
    };
    readonly pt_lg: {
        readonly paddingTop: any;
    };
    readonly pt_xl: {
        readonly paddingTop: any;
    };
    readonly pt_2xl: {
        readonly paddingTop: any;
    };
    readonly pt_3xl: {
        readonly paddingTop: any;
    };
    readonly pt_4xl: {
        readonly paddingTop: any;
    };
    readonly pt_5xl: {
        readonly paddingTop: any;
    };
    readonly pb_0: {
        readonly paddingBottom: 0;
    };
    readonly pb_2xs: {
        readonly paddingBottom: any;
    };
    readonly pb_xs: {
        readonly paddingBottom: any;
    };
    readonly pb_sm: {
        readonly paddingBottom: any;
    };
    readonly pb_md: {
        readonly paddingBottom: any;
    };
    readonly pb_lg: {
        readonly paddingBottom: any;
    };
    readonly pb_xl: {
        readonly paddingBottom: any;
    };
    readonly pb_2xl: {
        readonly paddingBottom: any;
    };
    readonly pb_3xl: {
        readonly paddingBottom: any;
    };
    readonly pb_4xl: {
        readonly paddingBottom: any;
    };
    readonly pb_5xl: {
        readonly paddingBottom: any;
    };
    readonly pl_0: {
        readonly paddingLeft: 0;
    };
    readonly pl_2xs: {
        readonly paddingLeft: any;
    };
    readonly pl_xs: {
        readonly paddingLeft: any;
    };
    readonly pl_sm: {
        readonly paddingLeft: any;
    };
    readonly pl_md: {
        readonly paddingLeft: any;
    };
    readonly pl_lg: {
        readonly paddingLeft: any;
    };
    readonly pl_xl: {
        readonly paddingLeft: any;
    };
    readonly pl_2xl: {
        readonly paddingLeft: any;
    };
    readonly pl_3xl: {
        readonly paddingLeft: any;
    };
    readonly pl_4xl: {
        readonly paddingLeft: any;
    };
    readonly pl_5xl: {
        readonly paddingLeft: any;
    };
    readonly pr_0: {
        readonly paddingRight: 0;
    };
    readonly pr_2xs: {
        readonly paddingRight: any;
    };
    readonly pr_xs: {
        readonly paddingRight: any;
    };
    readonly pr_sm: {
        readonly paddingRight: any;
    };
    readonly pr_md: {
        readonly paddingRight: any;
    };
    readonly pr_lg: {
        readonly paddingRight: any;
    };
    readonly pr_xl: {
        readonly paddingRight: any;
    };
    readonly pr_2xl: {
        readonly paddingRight: any;
    };
    readonly pr_3xl: {
        readonly paddingRight: any;
    };
    readonly pr_4xl: {
        readonly paddingRight: any;
    };
    readonly pr_5xl: {
        readonly paddingRight: any;
    };
    readonly m_0: {
        readonly margin: 0;
    };
    readonly m_2xs: {
        readonly margin: any;
    };
    readonly m_xs: {
        readonly margin: any;
    };
    readonly m_sm: {
        readonly margin: any;
    };
    readonly m_md: {
        readonly margin: any;
    };
    readonly m_lg: {
        readonly margin: any;
    };
    readonly m_xl: {
        readonly margin: any;
    };
    readonly m_2xl: {
        readonly margin: any;
    };
    readonly m_3xl: {
        readonly margin: any;
    };
    readonly m_4xl: {
        readonly margin: any;
    };
    readonly m_5xl: {
        readonly margin: any;
    };
    readonly m_auto: {
        readonly margin: "auto";
    };
    readonly mx_0: {
        readonly marginLeft: 0;
        readonly marginRight: 0;
    };
    readonly mx_2xs: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_xs: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_sm: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_md: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_lg: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_xl: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_2xl: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_3xl: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_4xl: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_5xl: {
        readonly marginLeft: any;
        readonly marginRight: any;
    };
    readonly mx_auto: {
        readonly marginLeft: "auto";
        readonly marginRight: "auto";
    };
    readonly my_0: {
        readonly marginTop: 0;
        readonly marginBottom: 0;
    };
    readonly my_2xs: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_xs: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_sm: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_md: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_lg: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_xl: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_2xl: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_3xl: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_4xl: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_5xl: {
        readonly marginTop: any;
        readonly marginBottom: any;
    };
    readonly my_auto: {
        readonly marginTop: "auto";
        readonly marginBottom: "auto";
    };
    readonly mt_0: {
        readonly marginTop: 0;
    };
    readonly mt_2xs: {
        readonly marginTop: any;
    };
    readonly mt_xs: {
        readonly marginTop: any;
    };
    readonly mt_sm: {
        readonly marginTop: any;
    };
    readonly mt_md: {
        readonly marginTop: any;
    };
    readonly mt_lg: {
        readonly marginTop: any;
    };
    readonly mt_xl: {
        readonly marginTop: any;
    };
    readonly mt_2xl: {
        readonly marginTop: any;
    };
    readonly mt_3xl: {
        readonly marginTop: any;
    };
    readonly mt_4xl: {
        readonly marginTop: any;
    };
    readonly mt_5xl: {
        readonly marginTop: any;
    };
    readonly mt_auto: {
        readonly marginTop: "auto";
    };
    readonly mb_0: {
        readonly marginBottom: 0;
    };
    readonly mb_2xs: {
        readonly marginBottom: any;
    };
    readonly mb_xs: {
        readonly marginBottom: any;
    };
    readonly mb_sm: {
        readonly marginBottom: any;
    };
    readonly mb_md: {
        readonly marginBottom: any;
    };
    readonly mb_lg: {
        readonly marginBottom: any;
    };
    readonly mb_xl: {
        readonly marginBottom: any;
    };
    readonly mb_2xl: {
        readonly marginBottom: any;
    };
    readonly mb_3xl: {
        readonly marginBottom: any;
    };
    readonly mb_4xl: {
        readonly marginBottom: any;
    };
    readonly mb_5xl: {
        readonly marginBottom: any;
    };
    readonly mb_auto: {
        readonly marginBottom: "auto";
    };
    readonly ml_0: {
        readonly marginLeft: 0;
    };
    readonly ml_2xs: {
        readonly marginLeft: any;
    };
    readonly ml_xs: {
        readonly marginLeft: any;
    };
    readonly ml_sm: {
        readonly marginLeft: any;
    };
    readonly ml_md: {
        readonly marginLeft: any;
    };
    readonly ml_lg: {
        readonly marginLeft: any;
    };
    readonly ml_xl: {
        readonly marginLeft: any;
    };
    readonly ml_2xl: {
        readonly marginLeft: any;
    };
    readonly ml_3xl: {
        readonly marginLeft: any;
    };
    readonly ml_4xl: {
        readonly marginLeft: any;
    };
    readonly ml_5xl: {
        readonly marginLeft: any;
    };
    readonly ml_auto: {
        readonly marginLeft: "auto";
    };
    readonly mr_0: {
        readonly marginRight: 0;
    };
    readonly mr_2xs: {
        readonly marginRight: any;
    };
    readonly mr_xs: {
        readonly marginRight: any;
    };
    readonly mr_sm: {
        readonly marginRight: any;
    };
    readonly mr_md: {
        readonly marginRight: any;
    };
    readonly mr_lg: {
        readonly marginRight: any;
    };
    readonly mr_xl: {
        readonly marginRight: any;
    };
    readonly mr_2xl: {
        readonly marginRight: any;
    };
    readonly mr_3xl: {
        readonly marginRight: any;
    };
    readonly mr_4xl: {
        readonly marginRight: any;
    };
    readonly mr_5xl: {
        readonly marginRight: any;
    };
    readonly mr_auto: {
        readonly marginRight: "auto";
    };
    readonly pointer_events_none: {
        readonly pointerEvents: "none";
    };
    readonly pointer_events_auto: {
        readonly pointerEvents: "auto";
    };
    readonly user_select_none: {
        readonly userSelect: "none";
    };
    readonly user_select_text: {
        readonly userSelect: "text";
    };
    readonly user_select_all: {
        readonly userSelect: "all";
    };
    readonly outline_inset_1: {
        readonly outlineOffset: -1;
    };
    readonly underline: {
        readonly textDecorationLine: "underline";
    };
    readonly strike_through: {
        readonly textDecorationLine: "line-through";
    };
    readonly hidden: {
        readonly display: "none";
    };
    readonly inline: any;
    readonly block: any;
    readonly contents: any;
    readonly transition_none: any;
    readonly transition_timing_default: any;
    readonly transition_all: any;
    readonly transition_color: any;
    readonly transition_opacity: any;
    readonly transition_transform: any;
    readonly transition_delay_50ms: any;
    readonly fade_in: any;
    readonly fade_out: any;
    readonly zoom_in: any;
    readonly zoom_out: any;
    readonly slide_in_left: any;
    readonly slide_out_left: any;
    readonly zoom_fade_in: any;
    /**
     * {@link Layout.SCROLLBAR_OFFSET}
     */
    readonly scrollbar_offset: {
        transform: Exclude<ViewStyle["transform"], string | undefined>;
    };
    readonly pointer: any;
};
//# sourceMappingURL=atoms.d.ts.map