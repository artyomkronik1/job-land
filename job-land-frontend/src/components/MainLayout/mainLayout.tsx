import {observer} from "mobx-react-lite";
import UserStore from '../../store/user';
import {useTranslation} from "react-i18next";
import React, {useContext, useState} from "react";
import {toast} from "react-toastify";
import Login from "../login/login";
import SignIn from "../signIn/signIn";
import styles from './mainLayout.module.scss'
import logo from'../../assets/images/icon.jpg'
import globalStyles from "../../assets/global-styles/styles.module.scss";
import SearchInput from "../../base-components/search-input/search-input";
import MessageBtn from "../../base-components/message-btn/message-btn-component";

const  MainLayout  = observer( ()=>{
    const { t } = useTranslation();
    const [useSearchValue, setSearchValue] = useState('');
    return (
      <div>
          {UserStore.getSessionKey()? (
              <div className={styles.main}>
                <div className={styles.left}>
                <img src={logo} />
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'start'}}>
                             <p>a</p>
                            <p>b</p>
                            <p>c</p>
                            <p>d</p>
                            <p>e</p>
                            <p>f</p>
                    </div>
                </div>

                  <div className={styles.right}>
                      <div className={styles.right_header}>
                          <h1 className={globalStyles.h2}> {t('Seeking or offering')}</h1>
                            <SearchInput placeHolder={'search...'}  value={useSearchValue} ariaLabel={'Search..'} onChange={(vaalue)=>setSearchValue(vaalue)}/>
                            <MessageBtn/>
                      </div>
                      <div className={styles.right_main}> main</div>
                  </div>
              </div>
          ) :
            <Login/>
          }
      </div>
    );
} )
export default MainLayout