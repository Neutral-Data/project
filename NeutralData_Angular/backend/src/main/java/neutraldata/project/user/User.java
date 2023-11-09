package neutraldata.project.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "users", uniqueConstraints={@UniqueConstraint(columnNames= {"username"})})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    @Size(max = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @Size(max = 100)
    private String lastName;
    
    @Column(nullable = false)
    @Size(max = 100)
    private String username;
    
    @Column(nullable = false)
    @Size(max = 100)
    private String email;

    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private String creationDate;

    @Column(nullable = false)
    private boolean enable;
    
    @Column(nullable = false)
    @Size(max = 100)
    private String password;
}
