package neutraldata.project.user;


import lombok.RequiredArgsConstructor;
import neutraldata.project.dto.CredentialsDto;
import neutraldata.project.dto.SignUpDto;
import neutraldata.project.dto.UserDto;
import neutraldata.project.exception.AppException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.CharBuffer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

	private UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

	@Autowired
	public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder,UserMapper userMapper ) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.userMapper = userMapper;
	}

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByUsername(credentialsDto.username())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepository.findByUsername(userDto.username());

        if (optionalUser.isPresent()) {
            throw new AppException("Login already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(userDto);
        user.setRole(UserRole.USER);
        user.setCreationDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        user.setEnable(true);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.password())));

        User savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }
    
    @Transactional
	public User saveUser(User user) throws DataAccessException {
    	user.setCreationDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
		user.setRole(UserRole.USER);
		user.setEnable(true);
		user.setPassword(passwordEncoder.encode(CharBuffer.wrap(user.getPassword())));
		return userRepository.save(user);
	}
	
	public User findUserById(Long id) {
		return userRepository.findById(id).orElseThrow(()->new UserNotFoundException("User by id"+ id+"was not found"));
	}
	
	public List<User> findAll() {
		return userRepository.findAll();
	}
	
	public void deleteUserById(Long id) {
		userRepository.deleteById(id);
	}
	
	public void deleteAll() {
		userRepository.deleteAll();
	}

}