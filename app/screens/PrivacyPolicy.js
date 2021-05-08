import React, { useState } from "react";
import colors from "../config/colours";
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container, Header, Left, Right, Body } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Linking from "expo-linking";
import { View } from "react-native";

export default function PrivacyPolicy({ navigation }) {
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const [ref, setRef] = useState(null);

  /* #region  Paragraphs */
  const One = () => (
    <View
      key={0}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[0] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>1. WHAT INFORMATION DO WE COLLECT?</Text>
      <Text style={styles.heading2}>
        Personal information you disclose to us
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We collect personal
        information that you provide to us.
      </Text>
      <Text style={styles.normal}>
        We collect personal information that you voluntarily provide to us when
        you register on the App, express an interest in obtaining information
        about us or our products and Services, when you participate in
        activities on the App (such as by posting messages in our online forums
        or entering competitions, contests or giveaways) or otherwise when you
        contact us.
      </Text>
      <Text style={styles.normal}>
        The personal information that we collect depends on the context of your
        interactions with us and the App, the choices you make and the products
        and features you use. The personal information we collect may include
        the following:
      </Text>
      <Text style={styles.normal}>
        <Text style={styles.bold}>Personal Information Provided by You.</Text>{" "}
        We collect email addresses; names; usernames; and other similar
        information.
      </Text>
      <Text style={styles.normal}>
        <Text style={styles.bold}>Social Media Login Data.</Text> We may provide
        you with the option to register with us using your existing social media
        account details, like your Facebook, Twitter or other social media
        account. If you choose to register in this way, we will collect the
        information described in the section called{" "}
        <Text style={{ ...styles.bold, fontStyle: "italic" }}>
          "How do we handle your social logins"
        </Text>{" "}
        below.
      </Text>
      <Text style={styles.normal}>
        All personal information that you provide to us must be true, complete
        and accurate, and you must notify us of any changes to such personal
        information.
      </Text>
      <Text style={styles.heading2}>Information collected through our App</Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We collect information
        regarding your geo-location, mobile device, push notifications, when you
        use our App.
      </Text>
      <Text style={styles.normal}>
        If you use our App, we also collect the following information:
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontStyle: "italic" }}>Geo-Location Information.</Text>{" "}
        We may request access or permission to and track location-based
        information from your mobile device, either continuously or while you
        are using our App, to provide certain location-based services. If you
        wish to change our access or permissions, you may do so in your device's
        settings.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontStyle: "italic" }}>Mobile Device Access.</Text> We
        may request access or permission to certain features from your mobile
        device, including your mobile device's camera, storage, and other
        features. If you wish to change our access or permissions, you may do so
        in your device's settings.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontStyle: "italic" }}>Push Notifications.</Text> We
        may request to send you push notifications regarding your account or
        certain features of the App. If you wish to opt-out from receiving these
        types of communications, you may turn them off in your device's
        settings.
      </Text>
      <Text style={styles.normal}>
        This information is primarily needed to maintain the security and
        operation of our App, for troubleshooting and for our internal analytics
        and reporting purposes.
      </Text>
    </View>
  );

  const Two = () => (
    <View
      key={1}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[1] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>2. HOW DO WE USE YOUR INFORMATION?</Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We process your information
        for purposes based on legitimate business interests, the fulfillment of
        our contract with you, compliance with our legal obligations, and/or
        your consent.
      </Text>
      <Text style={styles.normal}>
        We use personal information collected via our App for a variety of
        business purposes described below. We process your personal information
        for these purposes in reliance on our legitimate business interests, in
        order to enter into or perform a contract with you, with your consent,
        and/or for compliance with our legal obligations. We indicate the
        specific processing grounds we rely on next to each purpose listed
        below.
      </Text>
      <Text style={styles.normal}>
        We use the information we collect or receive:
      </Text>
      <Text style={styles.bullet}>
        •{" "}
        <Text style={{ fontWeight: "bold" }}>
          To facilitate account creation and logon process.
        </Text>{" "}
        If you choose to link your account with us to a third-party account
        (such as your Google or Facebook account), we use the information you
        allowed us to collect from those third parties to facilitate account
        creation and logon process for the performance of the contract. See the
        section below headed{" "}
        <Text style={{ ...styles.bold, fontStyle: "italic" }}>
          "How do we handle your social logins"
        </Text>{" "}
        for further information.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>To post testimonials.</Text> We
        post testimonials on our App that may contain personal information.
        Prior to posting a testimonial, we will obtain your consent to use your
        name and the content of the testimonial. If you wish to update, or
        delete your testimonial, please contact us at info.nicotiana@gmail.com
        and be sure to include your name, testimonial location, and contact
        information.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Request feedback.</Text> We may
        use your information to request feedback and to contact you about your
        use of our App.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Request feedback.</Text> We may
        use your information to request feedback and to contact you about your
        use of our App.
      </Text>
      <Text style={styles.bullet}>
        •{" "}
        <Text style={{ fontWeight: "bold" }}>
          To enable user-to-user communications.
        </Text>{" "}
        We may use your information in order to enable user-to-user
        communications with each user's consent.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>To manage user accounts.</Text>{" "}
        We may use your information for the purposes of managing our account and
        keeping it in working order.
      </Text>
      <Text style={styles.bullet}>
        •{" "}
        <Text style={{ fontWeight: "bold" }}>
          To send administrative information to you.
        </Text>{" "}
        We may use your personal information to send you product, service and
        new feature information and/or information about changes to our terms,
        conditions, and policies.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>To protect our Services.</Text>{" "}
        We may use your information as part of our efforts to keep our App safe
        and secure (for example, for fraud monitoring and prevention).
      </Text>
      <Text style={styles.bullet}>
        •{" "}
        <Text style={{ fontWeight: "bold" }}>
          To enforce our terms, conditions and policies for business purposes,
          to comply with legal and regulatory requirements or in connection with
          our contract.
        </Text>
      </Text>
      <Text style={styles.bullet}>
        •{" "}
        <Text style={{ fontWeight: "bold" }}>
          To respond to legal requests and prevent harm.
        </Text>{" "}
        If we receive a subpoena or other legal request, we may need to inspect
        the data we hold to determine how to respond.
      </Text>
    </View>
  );

  const Three = () => (
    <View
      key={2}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[2] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We only share information
        with your consent, to comply with laws, to provide you with services, to
        protect your rights, or to fulfill business obligations.
      </Text>
      <Text style={styles.normal}>
        We may process or share your data that we hold based on the following
        legal basis:
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Consent:</Text> We may process
        your data if you have given us specific consent to use your personal
        information for a specific purpose.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Legitimate Interests:</Text> We
        may process your data when it is reasonably necessary to achieve our
        legitimate business interests.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Performance of a Contract:</Text>{" "}
        Where we have entered into a contract with you, we may process your
        personal information to fulfill the terms of our contract.
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Legal Obligations:</Text> We may
        disclose your information where we are legally required to do so in
        order to comply with applicable law, governmental requests, a judicial
        proceeding, court order, or legal process, such as in response to a
        court order or a subpoena (including in response to public authorities
        to meet national security or law enforcement requirements).
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Vital Interests:</Text> We may
        disclose your information where we believe it is necessary to
        investigate, prevent, or take action regarding potential violations of
        our policies, suspected fraud, situations involving potential threats to
        the safety of any person and illegal activities, or as evidence in
        litigation in which we are involved.
      </Text>
      <Text style={styles.normal}>
        More specifically, we may need to process your data or share your
        personal information in the following situations:
      </Text>
      <Text style={styles.bullet}>
        • <Text style={{ fontWeight: "bold" }}>Business Transfers.</Text> We may
        share or transfer your information in connection with, or during
        negotiations of, any merger, sale of company assets, financing, or
        acquisition of all or a portion of our business to another company.
      </Text>
    </View>
  );

  const Four = () => (
    <View
      key={3}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[3] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        4. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> If you choose to register or
        log in to our services using a social media account, we may have access
        to certain information about you.
      </Text>
      <Text style={styles.normal}>
        Our App offers you the ability to register and login using your
        third-party social media account details (like your Facebook or Twitter
        logins). Where you choose to do this, we will receive certain profile
        information about you from your social media provider. The profile
        information we receive may vary depending on the social media provider
        concerned, but will often include your name, email address, friends
        list, profile picture as well as other information you choose to make
        public on such social media platform.{" "}
      </Text>
      <Text style={styles.normal}>
        We will use the information we receive only for the purposes that are
        described in this privacy notice or that are otherwise made clear to you
        on the relevant App. Please note that we do not control, and are not
        responsible for, other uses of your personal information by your
        third-party social media provider. We recommend that you review their
        privacy notice to understand how they collect, use and share your
        personal information, and how you can set your privacy preferences on
        their sites and apps.
      </Text>
    </View>
  );

  const Five = () => (
    <View
      key={4}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[4] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We are not responsible for
        the safety of any information that you share with third-party providers
        who advertise, but are not affiliated with, our Website.
      </Text>
      <Text style={styles.normal}>
        The App may contain advertisements from third parties that are not
        affiliated with us and which may link to other websites, online services
        or mobile applications. We cannot guarantee the safety and privacy of
        data you provide to any third parties. Any data collected by third
        parties is not covered by this privacy notice. We are not responsible
        for the content or privacy and security practices and policies of any
        third parties, including other websites, services or applications that
        may be linked to or from the App. You should review the policies of such
        third parties and contact them directly to respond to your questions.
      </Text>
    </View>
  );

  const Six = () => (
    <View
      key={5}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[5] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        6. HOW LONG DO WE KEEP YOUR INFORMATION?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We keep your information for
        as long as necessary to fulfill the purposes outlined in this privacy
        notice unless otherwise required by law.
      </Text>
      <Text style={styles.normal}>
        We will only keep your personal information for as long as it is
        necessary for the purposes set out in this privacy notice, unless a
        longer retention period is required or permitted by law (such as tax,
        accounting or other legal requirements). No purpose in this notice will
        require us keeping your personal information for longer than the period
        of time in which users have an account with us.
      </Text>
      <Text style={styles.normal}>
        We will only keep your personal information for as long as it is
        necessary for the purposes set out in this privacy notice, unless a
        longer retention period is required or permitted by law (such as tax,
        accounting or other legal requirements). No purpose in this notice will
        require us keeping your personal information for longer than the period
        of time in which users have an account with us.
      </Text>
    </View>
  );

  const Seven = () => (
    <View
      key={6}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[6] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        7. HOW DO WE KEEP YOUR INFORMATION SAFE?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We aim to protect your
        personal information through a system of organizational and technical
        security measures.
      </Text>
      <Text style={styles.normal}>
        We have implemented appropriate technical and organizational security
        measures designed to protect the security of any personal information we
        process. However, despite our safeguards and efforts to secure your
        information, no electronic transmission over the Internet or information
        storage technology can be guaranteed to be 100% secure, so we cannot
        promise or guarantee that hackers, cybercriminals, or other unauthorized
        third parties will not be able to defeat our security, and improperly
        collect, access, steal, or modify your information. Although we will do
        our best to protect your personal information, transmission of personal
        information to and from our App is at your own risk. You should only
        access the App within a secure environment.
      </Text>
    </View>
  );

  const Eight = () => (
    <View
      key={7}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[7] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        8. DO WE COLLECT INFORMATION FROM MINORS?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> We do not knowingly collect
        data from or market to children under 18 years of age.
      </Text>
      <Text style={styles.normal}>
        We do not knowingly solicit data from or market to children under 18
        years of age. By using the App, you represent that you are at least 18
        or that you are the parent or guardian of such a minor and consent to
        such minor dependent’s use of the App. If we learn that personal
        information from users less than 18 years of age has been collected, we
        will deactivate the account and take reasonable measures to promptly
        delete such data from our records. If you become aware of any data we
        may have collected from children under age 18, please contact us at
        info.nicotiana@gmail.com.
      </Text>
    </View>
  );

  const Nine = () => (
    <View
      key={8}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[8] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>9. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> In some regions, such as the
        European Economic Area, you have rights that allow you greater access to
        and control over your personal information. You may review, change, or
        terminate your account at any time.
      </Text>
      <Text style={styles.normal}>
        In some regions (like the European Economic Area), you have certain
        rights under applicable data protection laws. These may include the
        right (i) to request access and obtain a copy of your personal
        information, (ii) to request rectification or erasure; (iii) to restrict
        the processing of your personal information; and (iv) if applicable, to
        data portability. In certain circumstances, you may also have the right
        to object to the processing of your personal information. To make such a
        request, please use the contact details provided below. We will consider
        and act upon any request in accordance with applicable data protection
        laws.
      </Text>
      <Text style={styles.normal}>
        If we are relying on your consent to process your personal information,
        you have the right to withdraw your consent at any time. Please note
        however that this will not affect the lawfulness of the processing
        before its withdrawal, nor will it affect the processing of your
        personal information conducted in reliance on lawful processing grounds
        other than consent. If you are a resident in the European Economic Area
        and you believe we are unlawfully processing your personal information,
        you also have the right to complain to your local data protection
        supervisory authority. You can find their contact details here:{" "}
        <Text
          style={{ color: colors.highlight }}
          onPress={() =>
            Linking.openURL(
              "http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
            )
          }
        >
          http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
        </Text>
        .
      </Text>
      <Text style={styles.normal}>
        If you are a resident in Switzerland, the contact details for the data
        protection authorities are available here:{" "}
        <Text
          style={{ color: colors.highlight }}
          onPress={() =>
            Linking.openURL("https://www.edoeb.admin.ch/edoeb/en/home.html")
          }
        >
          https://www.edoeb.admin.ch/edoeb/en/home.html
        </Text>
        .
      </Text>
      <Text style={styles.normal}>
        If you have questions or comments about your privacy rights, you may
        email us at info.nicotiana@gmail.com.
      </Text>
      <Text style={styles.heading2}>Account Information</Text>
      <Text style={styles.normal}>
        If you would at any time like to review or change the information in
        your account or terminate your account, you can:
      </Text>
      <Text style={styles.bullet}>
        • Log in to your account settings and update your user account.
      </Text>
      <Text style={styles.normal}>
        Upon your request to terminate your account, we will deactivate or
        delete your account and information from our active databases. However,
        we may retain some information in our files to prevent fraud,
        troubleshoot problems, assist with any investigations, enforce our Terms
        of Use and/or comply with applicable legal requirements.
      </Text>
      <Text style={styles.normal}>
        <Text style={{ ...styles.bold, textDecorationLine: "underline" }}>
          Opting out of email marketing:
        </Text>{" "}
        You can unsubscribe from our marketing email list at any time by
        clicking on the unsubscribe link in the emails that we send or by
        contacting us using the details provided below. You will then be removed
        from the marketing email list — however, we may still communicate with
        you, for example to send you service-related emails that are necessary
        for the administration and use of your account, to respond to service
        requests, or for other non-marketing purposes. To otherwise opt-out, you
        may:
      </Text>
      <Text style={styles.bullet}>
        • Access your account settings and update your preferences.
      </Text>
    </View>
  );

  const Ten = () => (
    <View
      key={9}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[9] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        10. CONTROLS FOR DO-NOT-TRACK FEATURES
      </Text>
      <Text style={styles.normal}>
        Most web browsers and some mobile operating systems and mobile
        applications include a Do-Not-Track ("DNT") feature or setting you can
        activate to signal your privacy preference not to have data about your
        online browsing activities monitored and collected. At this stage no
        uniform technology standard for recognizing and implementing DNT signals
        has been finalized. As such, we do not currently respond to DNT browser
        signals or any other mechanism that automatically communicates your
        choice not to be tracked online. If a standard for online tracking is
        adopted that we must follow in the future, we will inform you about that
        practice in a revised version of this privacy notice.
      </Text>
    </View>
  );

  const Eleven = () => (
    <View
      key={10}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[10] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> Yes, if you are a resident of
        California, you are granted specific rights regarding access to your
        personal information.
      </Text>
      <Text style={styles.normal}>
        California Civil Code Section 1798.83, also known as the "Shine The
        Light" law, permits our users who are California residents to request
        and obtain from us, once a year and free of charge, information about
        categories of personal information (if any) we disclosed to third
        parties for direct marketing purposes and the names and addresses of all
        third parties with which we shared personal information in the
        immediately preceding calendar year. If you are a California resident
        and would like to make such a request, please submit your request in
        writing to us using the contact information provided below.
      </Text>
      <Text style={styles.normal}>
        If you are under 18 years of age, reside in California, and have a
        registered account with the App, you have the right to request removal
        of unwanted data that you publicly post on the App. To request removal
        of such data, please contact us using the contact information provided
        below, and include the email address associated with your account and a
        statement that you reside in California. We will make sure the data is
        not publicly displayed on the App, but please be aware that the data may
        not be completely or comprehensively removed from all our systems (e.g.
        backups, etc.).
      </Text>
      <Text style={styles.heading2}>CCPA Privacy Notice</Text>
      <Text style={styles.normal}>
        The California Code of Regulations defines a "resident" as:
      </Text>
      <Text style={styles.bullet}>
        (1) every individual who is in the State of California for other than a
        temporary or transitory purpose and
      </Text>
      <Text style={styles.bullet}>
        (2) every individual who is domiciled in the State of California who is
        outside the State of California for a temporary or transitory purpose
      </Text>
      <Text style={styles.normal}>
        All other individuals are defined as "non-residents."
      </Text>
      <Text style={styles.normal}>
        If this definition of "resident" applies to you, we must adhere to
        certain rights and obligations regarding your personal information.
      </Text>
      <Text style={styles.bold}>
        What categories of personal information do we collect?
      </Text>
      <Text style={styles.normal}>
        We have collected the following categories of personal information in
        the past twelve (12) months:
      </Text>
      <View>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.bold, flex: 1 }}>Category</Text>
          <Text style={{ ...styles.bold, flex: 1 }}>Examples</Text>
          <Text style={{ ...styles.bold, flex: 1, textAlign: "center" }}>
            Collected
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>A. Identifiers</Text>
          <Text style={styles.tableCellText}>
            Contact details, such as real name, alias, postal address, telephone
            or mobile contact number, unique personal identifier, online
            identifier, Internet Protocol address, email address and account
            name
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            YES
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            B. Personal information categories listed in the California Customer
            Records statute
          </Text>
          <Text style={styles.tableCellText}>
            Name, contact information, education, employment, employment history
            and financial information
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            YES
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            C. Protected classification characteristics under California or
            federal law
          </Text>
          <Text style={styles.tableCellText}>Gender and date of birth</Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            C. Protected classification characteristics under California or
            federal law
          </Text>
          <Text style={styles.tableCellText}>Gender and date of birth</Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>D. Commercial information</Text>
          <Text style={styles.tableCellText}>
            Transaction information, purchase history, financial details and
            payment information
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>E. Biometric information</Text>
          <Text style={styles.tableCellText}>Fingerprints and voiceprints</Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            F. Internet or other similar network activity
          </Text>
          <Text style={styles.tableCellText}>
            Browsing history, search history, online behavior, interest data,
            and interactions with our and other websites, applications, systems
            and advertisements
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>G. Geolocation data</Text>
          <Text style={styles.tableCellText}>Device location</Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            H. Audio, electronic, visual, thermal, olfactory, or similar
            information
          </Text>
          <Text style={styles.tableCellText}>
            Images and audio, video or call recordings created in connection
            with our business activities
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            I. Professional or employment-related information
          </Text>
          <Text style={styles.tableCellText}>
            Business contact details in order to provide you our services at a
            business level, job title as well as work history and professional
            qualifications if you apply for a job with us
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>J. Education Information</Text>
          <Text style={styles.tableCellText}>
            Student records and directory information
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellText}>
            K. Inferences drawn from other personal information
          </Text>
          <Text style={styles.tableCellText}>
            Inferences drawn from any of the collected personal information
            listed above to create a profile or summary about, for example, an
            individual’s preferences and characteristics
          </Text>
          <Text style={{ ...styles.tableCellText, textAlign: "center" }}>
            NO
          </Text>
        </View>
      </View>
      <Text style={styles.normal}>
        We may also collect other personal information outside of these
        categories instances where you interact with us in-person, online, or by
        phone or mail in the context of:
      </Text>
      <Text style={styles.bullet}>
        • Receiving help through our customer support channels;
      </Text>
      <Text style={styles.bullet}>
        • Participation in customer surveys or contests; and
      </Text>
      <Text style={styles.bullet}>
        • Facilitation in the delivery of our Services and to respond to your
        inquiries.
      </Text>
      <Text style={{ ...styles.bold, marginTop: 10 }}>
        How do we use and share your personal information?
      </Text>
      <Text style={styles.normal}>
        More information about our data collection and sharing practices can be
        found in this privacy notice.
      </Text>
      <Text style={styles.normal}>
        You may contact us by email at info.nicotiana@gmail.com, or by referring
        to the contact details at the bottom of this document.
      </Text>
      <Text style={styles.normal}>
        If you are using an authorized agent to exercise your right to opt-out
        we may deny a request if the authorized agent does not submit proof that
        they have been validly authorized to act on your behalf.
      </Text>
      <Text style={{ ...styles.bold, marginTop: 10 }}>
        Will your information be shared with anyone else?
      </Text>
      <Text style={styles.normal}>
        We may disclose your personal information with our service providers
        pursuant to a written contract between us and each service provider.
        Each service provider is a for-profit entity that processes the
        information on our behalf.
      </Text>
      <Text style={styles.normal}>
        We may use your personal information for our own business purposes, such
        as for undertaking internal research for technological development and
        demonstration. This is not considered to be "selling" of your personal
        data.
      </Text>
      <Text style={styles.normal}>
        Nicotiana has not disclosed or sold any personal information to third
        parties for a business or commercial purpose in the preceding 12 months.
        Nicotiana will not sell personal information in the future belonging to
        website visitors, users and other consumers.
      </Text>
      <Text style={{ ...styles.bold, marginTop: 10 }}>
        Your rights with respect to your personal data
      </Text>
      <Text style={{ ...styles.normal, textDecorationLine: "underline" }}>
        Right to request deletion of the data - Request to delete
      </Text>
      <Text style={styles.normal}>
        You can ask for the deletion of your personal information. If you ask us
        to delete your personal information, we will respect your request and
        delete your personal information, subject to certain exceptions provided
        by law, such as (but not limited to) the exercise by another consumer of
        his or her right to free speech, our compliance requirements resulting
        from a legal obligation or any processing that may be required to
        protect against illegal activities.
      </Text>
      <Text style={{ ...styles.normal, textDecorationLine: "underline" }}>
        Right to be informed - Request to know
      </Text>
      <Text style={styles.normal}>
        Depending on the circumstances, you have a right to know:
      </Text>
      <Text style={styles.bullet}>
        • whether we collect and use your personal information;
      </Text>
      <Text style={styles.bullet}>
        • the categories of personal information that we collect;
      </Text>
      <Text style={styles.bullet}>
        • the purposes for which the collected personal information is used;
      </Text>
      <Text style={styles.bullet}>
        • whether we sell your personal information to third parties;
      </Text>
      <Text style={styles.bullet}>
        • the categories of personal information that we sold or disclosed for a
        business purpose;
      </Text>
      <Text style={styles.bullet}>
        • the categories of third parties to whom the personal information was
        sold or disclosed for a business purpose; and
      </Text>
      <Text style={styles.bullet}>
        • the business or commercial purpose for collecting or selling personal
        information.
      </Text>
      <Text style={styles.normal}>
        In accordance with applicable law, we are not obligated to provide or
        delete consumer information that is de-identified in response to a
        consumer request or to re-identify individual data to verify a consumer
        request.
      </Text>
      <Text style={{ ...styles.normal, textDecorationLine: "underline" }}>
        Right to Non-Discrimination for the Exercise of a Consumer’s Privacy
        Rights
      </Text>
      <Text style={styles.normal}>
        We will not discriminate against you if you exercise your privacy
        rights.
      </Text>
      <Text style={{ ...styles.normal, textDecorationLine: "underline" }}>
        Verification process
      </Text>
      <Text style={styles.normal}>
        Upon receiving your request, we will need to verify your identity to
        determine you are the same person about whom we have the information in
        our system. These verification efforts require us to ask you to provide
        information so that we can match it with information you have previously
        provided us. For instance, depending on the type of request you submit,
        we may ask you to provide certain information so that we can match the
        information you provide with the information we already have on file, or
        we may contact you through a communication method (e.g. phone or email)
        that you have previously provided to us. We may also use other
        verification methods as the circumstances dictate.
      </Text>
      <Text style={styles.normal}>
        We will only use personal information provided in your request to verify
        your identity or authority to make the request. To the extent possible,
        we will avoid requesting additional information from you for the
        purposes of verification. If, however, we cannot verify your identity
        from the information already maintained by us, we may request that you
        provide additional information for the purposes of verifying your
        identity, and for security or fraud-prevention purposes. We will delete
        such additionally provided information as soon as we finish verifying
        you.
      </Text>
      <Text style={{ ...styles.normal, textDecorationLine: "underline" }}>
        Other privacy rights
      </Text>
      <Text style={styles.bullet}>
        • you may object to the processing of your personal data
      </Text>
      <Text style={styles.bullet}>
        • you may request correction of your personal data if it is incorrect or
        no longer relevant, or ask to restrict the processing of the data
      </Text>
      <Text style={styles.bullet}>
        • you can designate an authorized agent to make a request under the CCPA
        on your behalf. We may deny a request from an authorized agent that does
        not submit proof that they have been validly authorized to act on your
        behalf in accordance with the CCPA.
      </Text>
      <Text style={styles.bullet}>
        • you may request to opt-out from future selling of your personal
        information to third parties. Upon receiving a request to opt-out, we
        will act upon the request as soon as feasibly possible, but no later
        than 15 days from the date of the request submission.
      </Text>
      <Text style={styles.normal}>
        To exercise these rights, you can contact us by email at
        info.nicotiana@gmail.com, or by referring to the contact details at the
        bottom of this document. If you have a complaint about how we handle
        your data, we would like to hear from you.
      </Text>
    </View>
  );

  const Twelve = () => (
    <View
      key={11}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[11] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        12. DO WE MAKE UPDATES TO THIS NOTICE?
      </Text>
      <Text style={{ ...styles.normal, fontStyle: "italic" }}>
        <Text style={styles.bold}>In Short:</Text> Yes, we will update this
        notice as necessary to stay compliant with relevant laws.
      </Text>
      <Text style={styles.normal}>
        We may update this privacy notice from time to time. The updated version
        will be indicated by an updated "Revised" date and the updated version
        will be effective as soon as it is accessible. If we make material
        changes to this privacy notice, we may notify you either by prominently
        posting a notice of such changes or by directly sending you a
        notification. We encourage you to review this privacy notice frequently
        to be informed of how we are protecting your information.
      </Text>
    </View>
  );

  const Thirteen = () => (
    <View
      key={12}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[12] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
      </Text>
      <Text style={styles.normal}>
        If you have questions or comments about this notice, you may email us at{" "}
        <Text
          style={{ ...styles.normal, color: colors.highlight }}
          onPress={() => {
            Linking.openURL("mailto: info.nicotiana@gmail.com");
          }}
        >
          info.nicotiana@gmail.com
        </Text>
        .
      </Text>
    </View>
  );

  const Fourteen = () => (
    <View
      key={13}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        dataSourceCords[13] = layout.y;
        setDataSourceCords(dataSourceCords);
      }}
    >
      <Text style={styles.heading1}>
        14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
      </Text>
      <Text style={styles.normal}>
        Based on the applicable laws of your country, you may have the right to
        request access to the personal information we collect from you, change
        that information, or delete it in some circumstances. To request to
        review, update, or delete your personal information, please submit a
        request form by clicking{" "}
        <Text
          style={{ ...styles.normal, color: colors.highlight }}
          onPress={() => {
            Linking.openURL(
              "https://app.termly.io/notify/5b6c138d-b2f1-469c-a4e0-1aeaabc75fe4"
            );
          }}
        >
          here
        </Text>
        . We will respond to your request within 30 days.
      </Text>
    </View>
  );
  /* #endregion */

  const TOC = () => (
    <View>
      <Text style={styles.heading1}>TABLE OF CONTENTS</Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[0], animated: true })
        }
      >
        1. What information do we collect?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[1], animated: true })
        }
      >
        2. How do we use your information?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[2], animated: true })
        }
      >
        3. Will your information be shared with anyone?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[3], animated: true })
        }
      >
        4. How do we handle your social logins?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[4], animated: true })
        }
      >
        5. What is our stance on third-party websites?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[5], animated: true })
        }
      >
        6. How long do we keep your information?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[6], animated: true })
        }
      >
        7. How do we keep your information safe?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[7], animated: true })
        }
      >
        8. Do we collect information from minors?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[8], animated: true })
        }
      >
        9. What are your privacy rights?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[9], animated: true })
        }
      >
        10. Controls for do-not-track features
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[10], animated: true })
        }
      >
        11. Do California residents have specific privacy rights?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[11], animated: true })
        }
      >
        12. Do we make updates to this notice?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[12], animated: true })
        }
      >
        13. How can you contact us about this notice?
      </Text>
      <Text
        style={{ ...styles.normal, color: colors.highlight }}
        onPress={() =>
          ref.scrollTo({ x: 0, y: dataSourceCords[13], animated: true })
        }
      >
        14. How can you review, update or delete the data we collect from you?
      </Text>
    </View>
  );

  return (
    <Container style={styles.background}>
      <Header
        iosBarStyle="light-content"
        transparent
        androidStatusBarColor={colors.background}
        style={{
          backgroundColor: colors.background,
          elevation: 0,
        }}
      >
        <Left>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: hp(5),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"}
              size={hp(3)}
              color={colors.white}
              style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
            />
          </TouchableOpacity>
        </Left>
        <Body>
          <Text style={styles.title}>Privacy notice</Text>
        </Body>
        <Right />
      </Header>

      <ScrollView ref={setRef} style={{ paddingHorizontal: 20 }}>
        <Text style={{ textAlign: "center", color: colors.grey }}>
          Last updated March 29, 2021
        </Text>
        <Text style={styles.normal}>
          Thank you for choosing to be part of our community at Nicotiana (
          <Text style={styles.bold}>"Company", "we", "us", "our"</Text>). We are
          committed to protecting your personal information and your right to
          privacy. If you have any questions or concerns about this privacy
          notice, or our practices with regards to your personal information,
          please contact us at{" "}
          <Text
            style={{ ...styles.normal, color: colors.highlight }}
            onPress={() => {
              Linking.openURL("mailto: info.nicotiana@gmail.com");
            }}
          >
            info.nicotiana@gmail.com
          </Text>
          .
        </Text>
        <Text style={styles.normal}>
          When you use our mobile application, as the case may be (the{" "}
          <Text style={styles.bold}>"App"</Text>) and more generally, use any of
          our services (the <Text style={styles.bold}>"Services"</Text>, which
          include the App), we appreciate that you are trusting us with your
          personal information. We take your privacy very seriously. In this
          privacy notice, we seek to explain to you in the clearest way possible
          what information we collect, how we use it and what rights you have in
          relation to it. We hope you take some time to read through it
          carefully, as it is important. If there are any terms in this privacy
          notice that you do not agree with, please discontinue use of our
          Services immediately.
        </Text>
        <Text style={styles.normal}>
          This privacy notice applies to all information collected through our
          Services (which, as described above, includes our App), as well as,
          any related services, sales, marketing or events.
        </Text>
        <Text style={{ ...styles.bold, marginTop: 10 }}>
          Please read this privacy notice carefully as it will help you
          understand what we do with the information that we collect.Please read
          this privacy notice carefully as it will help you understand what we
          do with the information that we collect.
        </Text>

        <TOC />

        <One />
        <Two />
        <Three />
        <Four />
        <Five />
        <Six />
        <Seven />
        <Eight />
        <Nine />
        <Ten />
        <Eleven />
        <Twelve />
        <Thirteen />
        <Fourteen />

        <Text style={styles.normal}>
          This privacy policy was created using{" "}
          <Text
            style={{ ...styles.normal, color: colors.highlight }}
            onPress={() => {
              Linking.openURL(
                "https://termly.io/products/privacy-policy-generator/?ftseo"
              );
            }}
          >
            Termly’s Privacy Policy Generator
          </Text>
          .
        </Text>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
  },
  normal: {
    color: colors.white,
    fontSize: 16,
    textAlign: "justify",
    marginTop: 10,
  },
  bold: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "justify",
  },
  heading1: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "bold",
    marginTop: 20,
  },
  heading2: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
    marginTop: 10,
  },
  bullet: {
    color: colors.white,
    fontSize: 16,
    textAlign: "justify",
    marginTop: 10,
    marginStart: 30,
  },
  tableRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  tableCellText: {
    color: colors.white,
    flex: 1,
  },
});
